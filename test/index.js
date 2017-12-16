'use strict'

process.env.NODE_ENV = 'test';

const mongoose = require('mongoose')
const test = require('tape')
const sinon = require('sinon')
const request = require('supertest')
const server = require('../app/config/server.js')
const CarModel = require('../app/models/car.model')
const GarageModel = require('../app/models/garage.model')
const carController = require('../app/controllers/car.controller')

test('POST /api/cars give valid data should return json array data', function (assert) {
  
  //Arrange
  let garage = {
    _id:'123',
    address: 'address',
    phoneNumber: '12345',
    emailAddress: 'garage@admin.com',
    maxCars: 2,
    cars:[]
  }

  let garageObj = new GarageModel(garage)

  let expect = {
    brand: 'toyota',
    model: 'avanza',
    year: 2015,
    color: 'white',
    mileage: 2000,
    engine: 'vvti',
    power: 12323,
    price: 250000000,
    registrationDate: '2017-12-16T06:49:56.987Z',
    garage: '123'
  }

  sinon.stub(CarModel.prototype, 'save')
  .returns(expect)

  sinon.stub(GarageModel.prototype, 'save')
  .returns(garageObj)

  sinon.stub(GarageModel, 'findById')
  .returns(garageObj)

  //Act
  request(server)
    .post('/api/cars')
    .send(expect)
    .expect(201)
    .expect('Content-Type', /json/)
    .end(function (err, res) {

      //Assert
      assert.isNot(res.body, undefined)
      assert.isEquivalent(res.body.model, expect.model)
      assert.isEquivalent(res.body.brand, expect.brand)
      
      assert.error(err, 'No error')
      assert.end()

      //clean up
      GarageModel.findById.restore()
      GarageModel.prototype.save.restore()
      CarModel.prototype.save.restore()
  })
})

test('POST /api/cars give uncomplete data should return json data message mandatory', function (assert) {
  
  //Arrange
  let expect = 'brand / model / year/ garage / registration date are mandatory'
  let garage = {
    _id:'123',
    address: 'address',
    phoneNumber: '12345',
    emailAddress: 'garage@admin.com',
    maxCars: 2,
    cars:[]
  }

  let garageObj = new GarageModel(garage)

  let car = {
    model: 'avanza',
    year: 2015,
    color: 'white',
    mileage: 2000,
    engine: 'vvti',
    power: 12323,
    price: 250000000,
    registrationDate: '2017-12-16T06:49:56.987Z',
    garage: '123'
  }

  //Act
  request(server)
    .post('/api/cars')
    .send(car)
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {

      //Assert
      assert.isNot(res.body, undefined)
      assert.equal(res.body.message, expect)
      
      assert.error(err, 'No error')
      assert.end()

      //clean up
  })
})

test('POST /api/cars give valid data but garage is full should return json message garage is full', function (assert) {
  
  //Arrange
  let expect = 'Garage is Full!'

  let garage = {
    address: 'address',
    phoneNumber: '12345',
    emailAddress: 'garage@admin.com',
    maxCars: 1,
    cars: []
  }

  let garageObj = new GarageModel(garage)
  garageObj.cars.push(mongoose.Types.ObjectId('5a31f7831190701b85a82249'))

  let car = {
    brand: 'toyota',
    model: 'avanza',
    year: 2015,
    color: 'white',
    mileage: 2000,
    engine: 'vvti',
    power: 12323,
    price: 250000000,
    registrationDate: '2017-12-16T06:49:56.987Z',
    garage: mongoose.Types.ObjectId('5a3123eab57ecf02c9dbdc0d')
  }

  sinon.stub(GarageModel, 'findById')
  .returns(garageObj)

  //Act
  request(server)
    .post('/api/cars')
    .send(car)
    .expect(400)
    .expect('Content-Type', /json/)
    .end(function (err, res) {

      //Assert
      assert.isNot(res.body, undefined)
      assert.equal(res.body.message, expect)
      
      assert.error(err, 'No error')
      assert.end()

      //clean up
      GarageModel.findById.restore()
  })
})

test('GET /api/cars should return json array data', function (assert) {
  
    //Arrange
    let expect = [{
      brand: 'toyota',
      model: 'avanza',
      year: 2015,
      color: 'white',
      mileage: 2000,
      engine: 'vvti',
      power: 'Number',
      registrationDate: Date.now(),
      price: 250000000,
      garage: 'garage1'
    }]
  
    sinon.stub(CarModel, 'find')
    .returns({populate: () => {return expect}})
  
    sinon.stub(CarModel, 'populate')
    .returns(expect)
  
    //Act
    request(server)
      .get('/api/cars')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
  
        //Assert
        assert.isNot(res.body, undefined)
        assert.isEquivalent(res.body, expect)
        assert.error(err, 'No error')
        assert.end()

        //clean up
        CarModel.find.restore()
        CarModel.populate.restore()
    })
  })

  test('GET /api/cars/:carId give available carId should return json data', function (assert) {
  
    //Arrange
    let expect = 
    { _id: '5a31f7831190701b85a82249',
      brand: '1',
      model: '1',
      year: 1,
      color: '1',
      mileage: 1,
      engine: '1',
      power: 1,
      price: 1,
      registrationDate: '2017-12-16T05:52:45.577Z'
    }

    let expectObj = new CarModel(expect)
  
    sinon.stub(CarModel, 'findById')
    .returns({populate: () => {return expectObj}})
  
    sinon.stub(CarModel, 'populate')
    .returns(expectObj)
  
    //Act
    request(server)
      .get('/api/cars/5a31f7831190701b85a82249')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
  
        //Assert
        assert.isNot(res.body, undefined)
        assert.isEquivalent(res.body, expect)
        assert.error(err, 'No error')
        assert.end()

        //clean up
        CarModel.findById.restore()
        CarModel.populate.restore()
    })
  })

  test('GET /api/cars/:carId give unavailable carId should return json message Car not found', function (assert) {
  
    //Arrange
    let expect = {message: "Car not found!", success: false}

    sinon.stub(CarModel, 'findById')
    .returns({populate: () => {return expect}})
  
    sinon.stub(CarModel, 'populate')
    .returns(expect)
  
    //Act
    request(server)
      .get('/api/cars/5a31f7831190701b85a82249')
      .expect(404)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
  
        //Assert
        assert.isNot(res.body, undefined)
        assert.isEquivalent(res.body, expect)
        assert.error(err, 'No error')
        assert.end()

        //clean up
        CarModel.findById.restore()
        CarModel.populate.restore()
    })
  })
