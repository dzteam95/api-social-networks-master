const UserModel = require('../models/user.js')

/**
 * User
 * @class
 */
module.exports = class User {
  constructor (app, connect) {
    this.app = app
    this.UserModel = connect.model('User', UserModel)

    this.create()
    this.show()
    this.search()
    this.update()
    this.delete()
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
    this.app.post('/user/create/', (req, res) => {
      try {
        const userModel = this.UserModel(req.body)
        this.UserModel.find({ email: req.body.email }).then(user => {
          if (!user.length) {
            userModel.save().then(user => {
              res.status(200).json(user || {})
            }).catch(err => {
              res.status(500).json({
                code: 500,
                message: err
              })
            })
          } else {
            res.status(500).json({
              code: 500,
              message: 'Email already used'
            })
          }
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
   * search
   */
  search () {
    this.app.post('/user/search', (req, res) => {
      try {
        const pipe = [{ $limit: req.body.limit || 10 }]

        if (req.body.sort) {
          pipe.push({$sort: req.body.sort})
        }
        this.UserModel.aggregate(pipe).then(user => {
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
   * delete
   */
  delete () {
    this.app.post('/user/delete/:id', (req, res) => {
      try {
        this.UserModel.findByIdAndRemove(req.params.id).then(user => {
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
   * updata
   */
  update () {
    this.app.put('/user/update/:id', (req, res) => {
      try {
        this.UserModel.findByIdAndUpdate(req.params.id, req.body).then(user => {
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
