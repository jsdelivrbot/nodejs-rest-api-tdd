'use strict'; 

const mongoose = require('mongoose');
const Schema = mongoose.Schema

const carSchema = new Schema({
    brand: String,
    model: String,
    year: Number,
    color: String,
    mileage: Number,
    engine: String,
    power: Number,
    registrationDate: { type: Date, default: Date.now },
    price: Number,
    garage: {
        type: Schema.Types.ObjectId,
        ref: 'garage'
    }
});

module.exports = mongoose.model('car', carSchema);