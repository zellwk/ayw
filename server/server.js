const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const errorHandlers = require('./handlers/errorHandlers')
const isProduction = process.env.NODE_ENV === 'production'
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('dist'))

if (isProduction) {
  app.use(favicon(path.join(__dirname, '../', '/dist/favicons/favicon.ico')))
}

// ======================================
// # Error handlers
// ======================================
app.use(errorHandlers.notFound)

if (isProduction) {
  app.use(errorHandlers.prodErrors)
} else {
  app.use(errorHandlers.devErrors)
}

module.exports = app
