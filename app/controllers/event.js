const EventModel = require('../models/events')

/**
 * Event
 * @class
 */
class Event {
  constructor (app, connect) {
    this.app = app
    this.EventModel = connect.model('Event', EventModel)

    this.createEvent()
    this.jointEvent()
    this.getEvents()
    this.getEvent()
    this.leaveEVent()
    this.updateEvent()
    this.deleteEvent()
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
     * Rejoindre un evenement
     * @Endpoint : /v1/events/{id}/join
     * @Method : PUT
     */
    join_event() {
        this.app.put('/events/:id/join', (req, res) => {
            try {
                this.EventModel.findById(req.params.id).populate('managers, members').then(event => {
                    const _managers = event.managers;
                    const _members = event.members;
                    const _user_id = (req.body.user_id) ? req.body.user_id : false;
                    const _role = (req.body.manager) ? "manager" : "member";
                    
                    if(_managers.includes(_user_id) || _members.includes(_user_id)){
                        res.status(400).json(
                            { 
                                error: {
                                    status: 400,
                                    message: "user already in this event",
                                } 
                            }
                        ) 
                    }else{
                        let data;
                        if(_role == "member"){
                            _members.push(_user_id)
                            data = {members : _members}
                        }else if(_role == "manager"){
                            _managers.push(_user_id)
                            data = {managers : _managers}
                        }
                        this.EventModel.findByIdAndUpdate(req.params.id, data).populate('managers, members').then(event => {
                            res.status(201).json(
                                { 
                                    event: event, 
                                }
                            )
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
                    }
                })
                .catch(err => {
                    res.status(400).json(
                        { 
                            error: {
                                status: 400,
                                message: "invalid id",
                            } 
                        }
                    ) 
                })
            } catch {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error"} })
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
                        }
                    )
                }).populate('managers, members');
                
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
            this.EventModel.findById(req.params.id).populate('managers, members').then(event => {
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
          this.EventModel.findByIdAndUpdate(req.params.id, req.body).populate('managers, members').then(event => {
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
      /**
     * Supprimer un evenement
     * @Endpoint : /events/{id}/delete
     * @Method : DELETE
     */
    delete_event() {
        this.app.delete('/events/:id/delete', (req, res) => {
            try {
                this.EventModel.findByIdAndDelete(req.params.id).populate('managers, members').then(event => {
                    
                    if(event){
                        res.status(200).json(
                            { 
                                success: {
                                    status: 200,
                                    message: "successfully deleted",
                                }
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
