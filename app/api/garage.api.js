'use strict'; 

const Garage = require('../models/garage.model.js');
const GarageService = require('../services/garage.service.js')

module.exports = {
    create: async (req, res) => {
        const result = await GarageService.create(req)
        console.log('result: ',result)
        
        if(result instanceof Garage) {
            res.status(201).json(result)
        }
        else {
            res.status(400).send(result)
        }
    },

    findAll: async (req, res) => {
        const result = await GarageService.findAll(req)
        console.log('result: ',result)
        res.status(200).json(result)
    },

    findOne: async (req, res) => {
        const result = await GarageService.findOne(req)
        console.log('result: ',result)
        res.status(200).json(result)
    },

    update: async (req, res) => {
        const result = await GarageService.update(req)
        console.log('result: ',result)
        res.status(200).json(result)
    },

    delete: async (req, res) => {
        const result = await GarageService.delete(req)
        console.log('result: ',result)
        res.status(200).json(result)
    }
}
