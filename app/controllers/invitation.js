const InvitationModel = require('../models/invitations')

/**
 * Invitation
 * @class
 */

module.exports = class Invitation {
  constructor (app, connect) {
    this.app = app
    this.InvitationModel = connect.model('Invitation', InvitationModel)
    this.createInvitation()
    this.getInvitations()
    this.getInvitation()
    this.updateInvitation()
    this.deleteInvitation()
  }

  /**
   * Créer un invitation
   * @Endpoint : /invitations/create
   * @Method : POST
   */
  createInvitation () {
    this.app.post('/invitations/create/', (req, res) => {
      try {
        const invitationModel = new this.InvitationModel(req.body)
        if (req.body.type && (req.body.type === 'group' || req.body.type === 'event')) {
          this.InvitationModel.findOne({ type: 'group', id_destination: req.body.id_destination, id_receiver: req.body.id_receiver }, function (res, user) {
            if (user) {
              res.status(400).json(
                {
                  error: {
                    status: 400,
                    message: 'invitation already exist'
                  }
                }
              )
            } else {
              invitationModel.save().then(invitation => {
                res.status(201).json(
                  {
                    invitation: invitation
                  }
                )
              }).catch(res => {
                res.status(400).json(
                  {
                    error: {
                      status: 400,
                      message: 'error'
                    }
                  }
                )
              })
            }
          }).populate('id_receiver')
        } else {
          res.status(400).json(
            {
              error: {
                status: 400,
                message: 'invalid type'
              }
            }
          )
        }
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }

  /**
   * Récupérer tous les invitations
   * @Endpoint : /invitations
   * @Method : GET
   */
  getInvitations () {
    this.app.get('/invitations', (req, res) => {
      try {
        this.InvitationModel.find({}, function (res, invitations) {
          res.status(200).json(
            {
              invitations: invitations
            }
          )
        }).populate('id_receiver')
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }

  /**
   * Récupérer les données d'un invitation
   * @Endpoint : /invitations/{id}
   * @Method : GET
   */
  getInvitation () {
    this.app.get('/invitations/:id', (req, res) => {
      try {
        this.InvitationModel.findById(req.params.id).populate('id_receiver').then(invitation => {
          if (invitation) {
            res.status(200).json(
              {
                invitation: invitation
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
   * Editer un invitation
   * @Endpoint : /invitations/{id}/update
   * @Method : PUT
   */
  updateInvitation () {
    this.app.put('/invitations/:id/update', (req, res) => {
      try {
        this.InvitationModel.findByIdAndUpdate(req.params.id, req.body).populate('id_receiver').then(invitation => {
          if (invitation) {
            res.status(201).json(
              {
                invitation: invitation
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
   * Supprimer un invitation
   * @Endpoint : /invitations/{id}/delete
   * @Method : DELETE
   */
  deleteInvitation () {
    this.app.delete('/invitations/:id/delete', (req, res) => {
      try {
        this.InvitationModel.findByIdAndDelete(req.params.id).populate('id_receiver').then(invitation => {
          if (invitation) {
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
