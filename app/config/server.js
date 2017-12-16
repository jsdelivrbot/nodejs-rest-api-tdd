'use strict'; 

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')

const api = require('../routes/api.routes.js')
const cars = require('../routes/car.routes.js')
const garages = require('../routes/garage.routes.js')

const app = express();
app.use(express.static(path.join(__dirname, '../../public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())   
app.set('../views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('./pages/index'))

// Routes
app.use('/api', api)
app.use('/cars', cars)
app.use('/garages', garages)

// Catch 404 Erros
app.use((req,res,next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// Error handler function
app.use((err,req,res,next) => {
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500

    res.status(status).json({
        error: {
            message: error.message
        }
    })

    console.error(err)
})

module.exports = app
