'use strict'; 

const mongoose = require('mongoose');
const Schema = mongoose.Schema

const garageSchema = new Schema({
    name: String,
    address: String,
    phoneNumber: String,
    emailAddress: String,
    maxCars: Number,
    cars: [{
        type: Schema.Types.ObjectId,
        ref: 'car'
    }]
});

module.exports = mongoose.model('garage', garageSchema);