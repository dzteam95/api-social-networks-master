const DiscussionModel = require('../models/discussion.js')

/**
 * Discu
 * @class
 */
class Discussion {
  constructor (app, connect) {
    this.app = app
    this.DiscussionModel = connect.model('Discussion', DiscussionModel)

    this.createDiscu()
    this.getDiscus()
    this.getDiscu()
    this.updateDiscu()
  }

  /**
   * Create
   */
  createDiscu () {
    this.app.post('/discus/create', (req, res) => {
      try {
        const DiscussionModel = this.DiscuModel(req.body)

        DiscussionModel.save().then(discu => {
          res.status(200).json(discu || {})
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
   * Récupérer les données des discussions
   * @Endpoint : /discus
   * @Method : GET
   */
  getDiscus() {
    this.app.get('/discus', (req, res) => {
        try {
            this.DiscussionModel.find({}, function(err, discus) {
                res.status(200).json(
                    { 
                      discus: discus, 
                        totalDiscus: Object.keys(discus).length,
                    }
                )
            });
            
        } catch (err) {
            res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
        }
    })
  }
  /**
   * Récupérer les données d'une discusion
   * @Endpoint : /discus/{id}
   * @Method : GET
   */
  getDiscu() {
    this.app.get('/discus/:id', (req, res) => {
        try {
            this.DiscussionModel.findById(req.params.id).then(discu => {
                if(discu){
                    res.status(200).json(
                        { 
                            discu: discu, 
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
   * Update les données d'une discussion
   * @Endpoint : /discu/{id}/update
   * @Method : PUT
   */
  updateDiscu(){
    this.app.put('/discu/:id/update', (req, res) => {
      try {
          this.DiscussionModel.findByIdAndUpdate(req.params.id, req.body).then(discu => {
              if(discu){
                  res.status(201).json(
                      { 
                        discu: discu, 
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
} module.exports = Discussion