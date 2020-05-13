const EventModel = require('../models/events.js')

/**
 * Event
 * @class
 */
class Event {
  constructor (app, connect) {
    this.app = app
    this.EventModel = connect.model('Event', EventModel)

    this.createEvent()
    this.getEvents()
    this.getEvent()
    this.updateEvent()
  }

  /**
   * Create
   */
  createEvent () {
    this.app.post('/events/create', (req, res) => {
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
   * Récupérer les données des groupes
   * @Endpoint : /events
   * @Method : GET
   */
  getEvents() {
    this.app.get('/events', (req, res) => {
        try {
            this.EventModel.find({}, function(err, events) {
                res.status(200).json(
                    { 
                      events: events, 
                        totalEvents: Object.keys(events).length,
                    }
                )
            });
            
        } catch (err) {
            res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
        }
    })
  }
  /**
   * Récupérer les données d'un event
   * @Endpoint : /events/{id}
   * @Method : GET
   */
  getEvent() {
    this.app.get('/events/:id', (req, res) => {
        try {
            this.EventModel.findById(req.params.id).then(event => {
                if(event){
                    res.status(200).json(
                        { 
                          event: event, 
                        }
                    )
                }else{
                    res.status(400).json(
                        { 
                            error: {
                                status: 400,
                                message: "invalid id",
                            } 
                        }
                    )  
                }
                
            }).catch(err => {
                res.status(400).json(
                    { 
                        error: {
                            status: 400,
                            message: "invalid id",
                        } 
                    }
                ) 
            });
            
        } catch (err) {
            res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
        }
    })
  }

  /**
   * Update les données d'un event
   * @Endpoint : /events/{id}/update
   * @Method : PUT
   */
  updateEvent(){
    this.app.put('/event/:id/update', (req, res) => {
      try {
          this.EventModel.findByIdAndUpdate(req.params.id, req.body).then(event => {
              if(event){
                  res.status(201).json(
                      { 
                        event: event, 
                      }
                  )
              }else{
                  res.status(400).json(
                      { 
                          error: {
                              status: 400,
                              message: "invalid id",
                          } 
                      }
                  )  
              }
          }).catch(err => {
              res.status(400).json(
                  { 
                      error: {
                          status: 400,
                          message: "invalid id",
                      } 
                  }
              ) 
          });
      } catch {
          res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
      }
  }) 
  }
} module.exports = Event
