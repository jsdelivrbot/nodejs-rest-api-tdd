'use strict'; 

const router = require('express-promise-router')()
const garageCtrl = require('../controllers/garage.controller.js');
 
router.route('/')
    .get(garageCtrl.index)
    .post(garageCtrl.create)

router.route('/add')
    .get(garageCtrl.add)

router.route('/edit/:garageId')
    .get(garageCtrl.edit)
    .post(garageCtrl.update)
    
router.route('/delete/:garageId')
    .get(garageCtrl.delete)
    .post(garageCtrl.remove)

module.exports = router