const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const routes = require('./routes.js')

/**
 * Server
 * @Class
 */
class Server {
  constructor () {
    this.app = express()
  }

  /**
   * Data base connect
   * @return {Object} connect
   */
  dbConnect () {
    const host = 'mongodb+srv://Nabil:Bejaia954@cluster0-sfcbp.gcp.mongodb.net/test?retryWrites=true&w=majority'

    const connect = mongoose.createConnection(host)

    connect.on('error', (err) => {
      setTimeout(() => {
        console.error(`[ERROR] api dbConnect() -> ${err}`)
        this.connect = this.dbConnect(host)
      }, 5000)
    })

    connect.on('disconnected', () => {
      setTimeout(() => {
        console.log('[DISCONNECTED] api dbConnect() -> mongodb disconnected')
        this.connect = this.dbConnect(host)
      }, 5000)
    })

    process.on('SIGINT', () => {
      connect.close(() => {
        console.log('[API END PROCESS] api dbConnect() -> close mongodb connection')
        process.exit(0)
      })
    })

    return connect
  }

  /**
   * Middleware
   */
  middleware () {
    this.app.use(cors())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ 'extended': true }))
  }

  /**
   * Routes
   */
  routes () {
    new routes.Album(this.app, this.connect)
    new routes.Comment(this.app, this.connect)
    new routes.Discussion(this.app, this.connect)
    new routes.Event(this.app, this.connect)
    new routes.Group(this.app, this.connect)
    new routes.Invitation(this.app, this.connect)
    new routes.Message(this.app, this.connect)
    new routes.Sondages(this.app, this.connect)
    new routes.Shoppings(this.app, this.connect)
    new routes.User(this.app, this.connect)
    
    this.app.use((req, res) => {
      res.status(404).json({
        code: 404,
        message: 'not found'
      })
    })
  }

  /**
   * Run
   */
  
  run () {
    try {
      this.connect = this.dbConnect()
      this.dbConnect()
      this.middleware()
      this.routes()
      this.app.listen(4000)
    } catch (err) {
      console.log(`[ERROR] Server -> ${err}`)
    }
  }
}

module.exports = Server
