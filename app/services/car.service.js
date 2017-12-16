'use strict'; 

const Car = require('../models/car.model.js');
const Garage = require('../models/garage.model.js');

module.exports = {
    create: async (req) => {
        // Create and Save a new Car

        console.log(req.body)

        if(!req.body.brand || !req.body.model || !req.body.year || !req.body.garage || !req.body.registrationDate) {
            return {message: "brand / model / year/ garage / registration date are mandatory", success: false}
        }

        const { garage } = req.body

        let garageObj = await Garage.findById(garage)
        
        if(!garageObj) {
            return {message: "garage not found", success: false}
        }

        const isAvailableSlot = await module.exports.isAllowedGarage(garageObj)
        
        if(!isAvailableSlot) {
            console.log("Garage is Full!")
            return {message: "Garage is Full!", success: false}
        }

        let car = new Car(req.body)
        car.garage = garageObj 

        await car.save()

        garageObj.cars.push(car)

        await garageObj.save()

        return car
    },

    findAll: async () => {
        // Retrieve and return all Cars from the database.
        const cars = await Car.find().populate('garage')
        if(!cars) {
            return {message: "No found cars!", success: false}
        }
        return cars
    },

    findOne: async (req) => {
        
        const { carId } = req.params

        // Retrieve and return a single Car from the database.
        const singleCar = await Car.findById(carId).populate('garage')
        if(!singleCar) {
            return {message: "Car not found!", success: false}
        }
        return singleCar
    },

    update: async (req) => {
        
        const { carId } = req.params
        const updateCar = req.body

        console.log('updateCar: ', updateCar)

        if(!carId) {
            return {message: "car id is mandatory", success: false}
        }

        let destGarage = null
        let currGarage = null

        if(updateCar.garage != undefined && updateCar.garage) {
            
            destGarage = await Garage.findById(updateCar.garage)
        
            if(!destGarage) {
                return {message: "garage not found", success: false}
            }

            const isAvailableSlot = await module.exports.isAllowedGarage(destGarage)

            if(!isAvailableSlot) {
                return {message: "Garage is Full!", success: false}
            }

            currGarage = await Garage.findById(updateCar.currGarage)
        }

        const result = await Car.findByIdAndUpdate(carId, updateCar)

        if(!result) return {message: "Car not found!", success: false}

        //add car to new garage's collection
        if(destGarage) {
            destGarage.cars.push(result)

            await destGarage.save()
        }

        //remove car from previous garage's collection
        if(currGarage) {
            const indexOfId = currGarage.cars.indexOf(carId)
            currGarage.cars.splice(indexOfId,1)
            
            await currGarage.save()
        }

        return {message: "Car updated!", success: true}
    },

    delete: async (req) => {
        
        const { carId } = req.params

        if(!carId) {
            return {message: "car id is mandatory", success: false}
        }

        const result = await Car.findByIdAndRemove(carId)
        
        if(!result) {
            return {message: "Car not found!", success: false}
        }

        const garageId = result.garage
        let garage = await Garage.findById(garageId)

        if(garage) {
            const indexOfId = garage.cars.indexOf(carId)
            garage.cars.splice(indexOfId,1)
            
            const updateGarage = await garage.save()
            console.log('update garage: ', updateGarage)
        }
        
        return {success:true}
    },

    isAllowedGarage: async (garage) => {
        
        if(garage.cars.length >= garage.maxCars) {
            return false
        }

        return true
    }
}
