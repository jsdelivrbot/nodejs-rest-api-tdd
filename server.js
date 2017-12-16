'use strict'; 

const db = require('./app/config/db.js')
const server = require('./app/config/server.js')

const PORT = process.env.PORT || 5000

db.connect('mongodb://jpx:jpx@ds137256.mlab.com:37256/jpx', {
	useMongoClient: true
})

server.listen(PORT, () => console.log(`Listening on ${ PORT }`))

