'use strict'; 

const Car = require('../models/car.model.js');
const Garage = require('../models/garage.model.js');

module.exports = {
    create: async (req) => {
        
        if(!req.body.name || !req.body.address || !req.body.maxCars) {
            return {message: "name / address / Maximum cars are mandatory", success: false}
        }

        let garage = new Garage(req.body)
       
        await garage.save()

        return garage
    },

    findAll: async () => {
        // Retrieve and return all Cars from the database.
        const garages = await Garage.find().populate('cars')
        console.log('garages: ', garages)

        return garages
    },

    findOne: async (req) => {
        
        const { garageId } = req.params

        // Retrieve and return a single Car from the database.
        const singleGarage = await Garage.findById(garageId).populate('cars')
        console.log('garage: ', singleGarage)

        return singleGarage
    },

    update: async (req) => {
        
        const { garageId } = req.params
        const updateGarage = req.body

        const result = await Garage.findByIdAndUpdate(garageId, updateGarage)
        console.log('result: ',result)

        if(!result) return {message: "Garage not found!", success: false}

        return {success:true}
    },

    delete: async (req) => {
        
        const { garageId } = req.params

        const result = await Garage.findByIdAndRemove(garageId)
        console.log('result: ',result)

        if(!result) return null

        const cars = result.cars

        if(cars) {
            cars.forEach(async (id) => {
                let car = await Car.findById(id)
                car.garage = null

                await car.save()
            })
        }
        
        return {success:true}
    }
}
