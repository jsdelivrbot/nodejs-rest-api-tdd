'use strict'; 

const Car = require('../models/car.model.js');
const CarService = require('../services/car.service.js')
const GarageService = require('../services/garage.service.js')

module.exports = {
    index: async (req, res) => {
        const results = await CarService.findAll()
        const { message } = req.query
        res.render('pages/car/index', {title: 'Car', results: results, message: message} ); 
    },

    add: async (req, res) => {
        
        const garages = await GarageService.findAll(req)
        const { error,brand,model,year,color,mileage,engine,power,price,registrationDate,garage,currGarage } = req.query

        const datas = {
            title: 'Car',
            garages: garages, 
            readOnly: '',
            action: '/cars',
            error: error,
            brand: brand,
            model: model,
            year: year,
            color: color,
            mileage: mileage,
            engine: engine,
            power: power,
            price: price,
            registrationDate: registrationDate,
            garage: garage,
            currGarage: currGarage
        }

        console.log('req.query: ', req.query)

        res.render('pages/car/form', datas); 
    },

    create: async (req, res) => {

        const { brand,model,year,color,mileage,engine,power,price,registrationDate,garage,currGarage } = req.body
        
        try {
            
            const result = await CarService.create(req)
            console.log('result: ',result)
    
            if(result instanceof Car) {
                res.redirect('/cars?message=success create data')
            }
            else {
                res.redirect('/cars/add?error='+result.message+'&brand='+brand+'&model='+model+'&year='+year+'&color='+color+'&mileage='+mileage+'&engine='+engine+'&power='+power+'&price='+price+'&registrationDate='+registrationDate+'&garage='+garage+'&currGarage='+currGarage)
            }
        } catch (error) {
            res.redirect('/cars/add?error='+error+'&brand='+brand+'&model='+model+'&year='+year+'&color='+color+'&mileage='+mileage+'&engine='+engine+'&power='+power+'&price='+price+'&registrationDate='+registrationDate+'&garage='+garage+'&currGarage='+currGarage)
        }
    },

    edit: async (req, res) => {

        const { error } = req.query
        let result = {}
        let garageId = '';
        let currGarage = ''

        if(error) {
            const { carId } = req.params

            result = req.query
            result._id = carId
            garageId = result.garage
            currGarage = result.currGarage
        }
        else {
            result = await CarService.findOne(req)
            
            if(result.garage) {
                garageId = result.garage._id
                currGarage = garageId
            }
        }

        if(!result) {
            res.redirect('/cars')
            return
        }

        const garages = await GarageService.findAll()

        const datas = {
            title: 'Car',
            garages: garages, 
            readOnly: '',
            action: '/cars/edit/'+result._id,
            error: error,
            brand: result.brand,
            model: result.model,
            year: result.year,
            color: result.color,
            mileage: result.mileage,
            engine: result.engine,
            power: result.power,
            price: result.price,
            registrationDate: result.registrationDate,
            garage: garageId,
            currGarage: currGarage
        }
        
        console.log('datas: ', datas)

        res.render('pages/car/form', datas); 
    },

    update: async (req, res) => {

        const { carId } = req.params
        const { brand,model,year,color,mileage,engine,power,price,registrationDate,garage,currGarage } = req.body
        
        try {

            if(garage == currGarage) {
                delete req.body.garage
            }

            const result = await CarService.update(req)
    
            if(result.success) { 
                res.redirect('/cars?message=success update data')
            }
            else {
                res.redirect('/cars/edit/'+carId+'?error='+result.message+'&brand='+brand+'&model='+model+'&year='+year+'&color='+color+'&mileage='+mileage+'&engine='+engine+'&power='+power+'&price='+price+'&registrationDate='+registrationDate+'&garage='+garage+'&currGarage='+currGarage)
            
                // res.redirect('/cars/edit/'+carId+'?error='+result.message)
            }  
        } catch (error) {
            res.redirect('/cars/edit/'+carId+'?error='+error.message+'&brand='+brand+'&model='+model+'&year='+year+'&color='+color+'&mileage='+mileage+'&engine='+engine+'&power='+power+'&price='+price+'&registrationDate='+registrationDate+'&garage='+garage+'&currGarage='+currGarage)
            
        }
        
    },

    delete: async (req, res) => {
        const garages = await GarageService.findAll()
        
        const result = await CarService.findOne(req)
        console.log('result: ',result)

        if(!result) {
            res.redirect('/cars')
            return
        }
        
        const { error } = req.query

        let garageId = '';

        if(result.garage) {
            garageId = result.garage._id
        }

        const datas = {
            title: 'Car',
            garages: garages, 
            readOnly: 'readonly',
            action: '/cars/delete/'+result._id,
            error: error,
            brand: result.brand,
            model: result.model,
            year: result.year,
            color: result.color,
            mileage: result.mileage,
            engine: result.engine,
            power: result.power,
            price: result.price,
            registrationDate: result.registrationDate,
            garage: garageId,
            currGarage: garageId
        }

        console.log('datas: ', datas)

        res.render('pages/car/form', datas); 
    },

    remove: async (req, res) => {
        const result = await CarService.delete(req)
        
        if(result) { 
            res.redirect('/cars?message=success delete data')
        }
        else {
            const { carId } = req.params
            res.redirect('/cars/delete/'+carId+'?error=error')
        }
    }
}
