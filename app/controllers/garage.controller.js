'use strict'; 

const Garage = require('../models/garage.model.js');
const GarageService = require('../services/garage.service.js')

module.exports = {
    index: async (req, res) => {
        const result = await GarageService.findAll(req)
        const { message } = req.query
        res.render('pages/garage/index', {title: 'Garage', results: result, message: message} ); 
    },

    add: async (req, res) => {

        const { error,name,address,phoneNumber,emailAddress,maxCars } = req.query

        const datas = {
            title: 'Garage',
            readOnly: '',
            action: '/garages',
            error: error,
            name: name,
            address: address,
            phoneNumber: phoneNumber,
            emailAddress: emailAddress,
            maxCars: maxCars
        }

        res.render('pages/garage/form', datas); 
    },

    create: async (req, res) => {
       
        const { name,address,phoneNumber,emailAddress,maxCars} = req.body
        
        try {
            const result = await GarageService.create(req)
            console.log('result: ',result)
    
            if(result instanceof Garage) {
                res.redirect('/garages?message=success create data')
            }
            else {
                res.redirect('/garages/add?error='+result.message+'&name='+name+'&address='+address+'&phoneNumber='+phoneNumber+'&emailAddress='+emailAddress+'&maxCars='+maxCars)
            }
        } catch (error) {
            res.redirect('/garages/add?error='+error+'&name='+name+'&address='+address+'&phoneNumber='+phoneNumber+'&emailAddress='+emailAddress+'&maxCars='+maxCars)
        }
    },

    edit: async (req, res) => {

        const result = await GarageService.findOne(req)
        console.log('result: ',result)

        if(!result) {
            res.redirect('/garages')
            return
        }
        
        const { error } = req.query

        const datas = {
            title: 'Garage',
            readOnly: '',
            action: '/garages/edit/'+result._id,
            error: error,
            name: result.name,
            address: result.address,
            phoneNumber: result.phoneNumber,
            emailAddress: result.emailAddress,
            maxCars: result.maxCars
        }

        console.log('datas: ', datas)

        res.render('pages/garage/form', datas); 
    },

    update: async (req, res) => {
        
        const { garageId } = req.params

        try {
            const result = await GarageService.update(req)
            console.log('update result: ', result)
    
            if(result) { 
                res.redirect('/garages?message=success update data')
                return
            }
            else {
                res.redirect('/garages/edit/'+garageId+'?error=garage not found')
            }

        } catch (error) {
            res.redirect('/garages/edit/'+garageId+'?error='+error)
        }        
    },

    delete: async (req, res) => {
        const result = await GarageService.findOne(req)
        console.log('result: ',result)

        if(!result) {
            res.redirect('/garages')
            return
        }
        
        const { error } = req.query

        const datas = {
            title: 'Garage',
            readOnly: 'readonly',
            action: '/garages/delete/'+result._id,
            error: error,
            name: result.name,
            address: result.address,
            phoneNumber: result.phoneNumber,
            emailAddress: result.emailAddress,
            maxCars: result.maxCars
        }

        console.log('datas: ', datas)

        res.render('pages/garage/form', datas); 
    },

    remove: async (req, res) => {
        const result = await GarageService.delete(req)
        
        if(result) { 
            res.redirect('/garages?message=success delete data')
        }
        else {
            const { carId } = req.params
            res.redirect('/garages/delete/'+carId+'?error=error')
        }
    }
}
