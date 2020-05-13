const GroupModel = require('../models/group.js')

/**
 * Group
 * @class
 */
class Group {
  constructor (app, connect) {
    this.app = app
    this.GroupModel = connect.model('Group', GroupModel)

    this.createGroup()
    this.getGroups()
    this.getGroup()
    this.updateGroup()
  }

  /**
   * Create
   */
  createGroup () {
    this.app.post('/groups/create', (req, res) => {
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

  /**
   * Récupérer les données des groupes
   * @Endpoint : /groups
   * @Method : GET
   */
  getGroups() {
    this.app.get('/groups', (req, res) => {
        try {
            this.GroupModel.find({}, function(err, groups) {
                res.status(200).json(
                    { 
                      groups: groups, 
                        totalGroups: Object.keys(groups).length,
                    }
                )
            });
            
        } catch (err) {
            res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
        }
    })
  }
  /**
   * Récupérer les données d'un group
   * @Endpoint : /groups/{id}
   * @Method : GET
   */
  getGroup() {
    this.app.get('/groups/:id', (req, res) => {
        try {
            this.GroupModel.findById(req.params.id).then(group => {
                if(group){
                    res.status(200).json(
                        { 
                          group: group, 
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
   * Update les données d'un group
   * @Endpoint : /groups/{id}/update
   * @Method : PUT
   */

  updateGroup(){
    this.app.put('/group/:id/update', (req, res) => {
      try {
          this.GroupModel.findByIdAndUpdate(req.params.id, req.body).then(group => {
              if(group){
                  res.status(201).json(
                      { 
                        group: group, 
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

}
module.exports = Group