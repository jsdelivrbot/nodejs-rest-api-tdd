'use strict'; 

const router = require('express-promise-router')()
const carApi = require('../api/car.api.js');
const garageApi = require('../api/garage.api.js');

router.route('/cars')
    .post(carApi.create)
    .get(carApi.findAll)

router.route('/cars/:carId')
    .get(carApi.findOne)
    .patch(carApi.update)
    .delete(carApi.delete)
        
router.route('/garages')
    .post(garageApi.create)
    .get(garageApi.findAll)

router.route('/garages/:garageId')
    .get(garageApi.findOne)
    .patch(garageApi.update)
    .delete(garageApi.delete)

module.exports = router