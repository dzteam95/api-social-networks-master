const UserModel = require('../models/user.js')

/**
 * User
 * @class
 */
class User {
  constructor (app, connect) {
    this.app = app
    this.UserModel = connect.model('User', UserModel)

    this.create()
    this.show()
  }

  show () {
    this.app.get('/user/show/:id', (req, res) => {
      try {
        this.UserModel.findById(req.params.id).then(user => {
          res.status(200).json(user || {})
        }).catch(err => {
          res.status(500).json({
            code: 500,
            message: err
          })
        })
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: err
        })
      }
    })
  }

  /**
   * Create
   */
  create () {
    this.app.post('/user/create', (req, res) => {
      try {
        const userModel = this.UserModel(req.body)

        userModel.save().then(user => {
          res.status(200).json(user || {})
        }).catch(err => {
          res.status(500).json({
            code: 500,
            message: err
          })
        })
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: err
        })
      }
    })
  }
}

module.exports = User
