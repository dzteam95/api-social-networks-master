const EventModel = require('../models/events')

/**
 * Event
 * @class
 */
module.exports = class Event {
  constructor (app, connect) {
    this.app = app
    this.EventModel = connect.model('Event', EventModel)
    this.createEvent()
    this.jointEvent()
    this.getEvents()
    this.getEvent()
    this.updateEvent()
    this.deleteEvent()
  }

  /**
   * Create
   */
  createEvent () {
    this.app.post('/events/create/', (req, res) => {
      try {
        const eventModel = this.EventModel(req.body)
        eventModel.save().then(event => {
          res.status(200).json(event || {})
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
   * Rejoindre un evenement
   * @Endpoint : /v1/events/{id}/join
   * @Method : PUT
   */
  jointEvent () {
    this.app.put('/events/:id/join', (req, res) => {
      try {
        this.EventModel.findById(req.params.id).populate('managers, members').then(event => {
          const _admins = event.admins
          const _members = event.members
          const _userId = (req.body.user_id) ? req.body.user_id : false
          const _role = (req.body.admin) ? 'manager' : 'member'
          if (_admins.includes(_userId) || _members.includes(_userId)) {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'user already in this event'
                }
              }
            )
          } else {
            let data
            if (_role === 'member') {
              _members.push(_userId)
              data = {members: _members}
            } else if (_role === 'admin') {
              _admins.push(_userId)
              data = {managers: _admins}
            }
            this.EventModel.findByIdAndUpdate(req.params.id, data).populate('admins, members').then(event => {
              res.status(201).json(
                {
                  event: event
                }
              )
            }).catch(res => {
              res.status(400).json(
                {
                  error: {
                    status: 400,
                    message: 'invalid id'
                  }
                }
              )
            })
          }
        })
          .catch(res => {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'invalid id'
                }
              }
            )
          })
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }

  /**
   * Récupérer les données des groupes
   * @Endpoint : /events
   * @Method : GET
   */
  getEvents () {
    this.app.get('/events/', (req, res) => {
      try {
        this.EventModel.find({}, function (err, events) {
          res.status(200).json(
            {
              events: events
            }
          )
        }).populate('admins, admins')
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
  /**
   * Récupérer les données d'un event
   * @Endpoint : /events/{id}
   * @Method : GET
   */
  getEvent () {
    this.app.get('/events/:id', (req, res) => {
      try {
        this.EventModel.findById(req.params.id).populate('admins, members').then(event => {
          if (event) {
            res.status(200).json(
              {
                event: event
              }
            )
          } else {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'invalid id'
                }
              }
            )
          }
        }).catch(res => {
          res.status(400).json(
            {
              error: {
                status: 400,
                message: 'invalid id'
              }
            }
          )
        })
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }

  /**
   * Update les données d'un event
   * @Endpoint : /events/{id}/update
   * @Method : PUT
   */
  updateEvent () {
    this.app.put('/events/:id/update', (req, res) => {
      try {
        this.EventModel.findByIdAndUpdate(req.params.id, req.body).populate('admins, admins').then(event => {
          if (event) {
            res.status(201).json(
              {
                event: event
              }
            )
          } else {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'invalid id'
                }
              }
            )
          }
        }).catch(res => {
          res.status(400).json(
            {
              error: {
                status: 400,
                message: 'invalid id'
              }
            }
          )
        })
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
  /**
   * Supprimer un evenement
   * @Endpoint : /events/{id}/delete
   * @Method : DELETE
   */
  deleteEvent () {
    this.app.delete('/events/:id/delete', (req, res) => {
      try {
        this.EventModel.findByIdAndDelete(req.params.id).populate('managers, members').then(event => {
          if (event) {
            res.status(200).json(
              {
                success: {
                  status: 200,
                  message: 'successfully deleted'
                }
              }
            )
          } else {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'invalid id'
                }
              }
            )
          }
        }).catch(res => {
          res.status(400).json(
            {
              error: {
                status: 400,
                message: 'invalid id'
              }
            }
          )
        })
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
}
