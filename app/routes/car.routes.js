'use strict'; 

const router = require('express-promise-router')()
const carCtrl = require('../controllers/car.controller.js');

router.route('/')
    .get(carCtrl.index)
    .post(carCtrl.create)

router.route('/add')
    .get(carCtrl.add)

router.route('/edit/:carId')
    .get(carCtrl.edit)
    .post(carCtrl.update)
router.route('/delete/:carId')
    .get(carCtrl.delete)
    .post(carCtrl.remove)

module.exports = router