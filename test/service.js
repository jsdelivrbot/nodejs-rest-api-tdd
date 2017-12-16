'use strict'

const model = require('./model')

module.exports = {
    findById: (id) => {
        return model.findById(id)
    }
}