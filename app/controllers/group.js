const GroupModel = require('../models/group.js')

/**
 * Group
 * @class
 */
class Group {
  constructor (app, connect) {
    this.app = app
    this.GroupModel = connect.model('Group', GroupModel)

    this.create()
  }

  /**
   * Create
   */
  create () {
    this.app.post('/group/create', (req, res) => {
      try {
        const groupModel = this.GroupModel(req.body)

        groupModel.save().then(group => {
          res.status(200).json(group || {})
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

module.exports = Group
