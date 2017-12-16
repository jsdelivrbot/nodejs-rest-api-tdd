'use strict'; 

const Car = require('../models/car.model.js');
const CarService = require('../services/car.service.js')

module.exports = {
    create: async (req, res) => {
        const result = await CarService.create(req)
        
        if(result instanceof Car) {
            res.status(201).json(result)
        }
        else {
            res.status(400).send(result)
        }
    },

    findAll: async (req, res) => {
        const result = await CarService.findAll() 
       
        if(result instanceof Array && result.length > 0) {
            res.status(200).json(result)
        }
        else {
            res.status(404).json(result)
        }
    },

    findOne: async (req, res) => {
        const result = await CarService.findOne(req)
       
        if(result instanceof Car) {
            res.status(200).json(result)
        }
        else {
            res.status(404).send(result)
        }
    },

    update: async (req, res) => {
        const result = await CarService.update(req)
        
        if(result.success) {
            res.status(200).json(result)
        }
        else {
            res.status(400).json(result)
        }
        
    },

    delete: async (req, res) => {
        const result = await CarService.delete(req)
        
        if(result.success) {
            res.status(200).json(result)
        }
        else {
            res.status(404).json(result)
        }
    }
}
