const GroupModel = require('../models/group')
const InvitationModel = require('../models/invitations')

/**
 * Group
 * @class
 */
module.exports = class Group {
  constructor (app, connect) {
    this.app = app
    this.GroupModel = connect.model('Group', GroupModel)
    this.InvitationModel = connect.model('Invitation', InvitationModel)
    this.createGroup()
    this.inviteGroup()
    this.joinGroup()
    this.leaveGroup()
    this.getGroup()
    this.getGroups()
  }

  /**
   * Create
   */

  createGroup () {
    this.app.post('/groups/create/', (req, res) => {
      try {
        const GroupModel = new this.GroupModel(req.body)
        if (req.body.admins && req.body.admins[0]) {
          if (req.body.group_type && (req.body.group_type === 'public' || req.body.group_type === 'private' || req.body.group_type === 'secret')) {
            GroupModel.save().then(group => {
              res.status(201).json(
                {
                  group: group
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
          } else {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'Group_type not accepted (public, private, secret)'
                }
              }
            )
          }
        } else {
          res.status(400).json(
            {
              error: {
                status: 400,
                message: 'Owner is not defined'
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
   * Inviter dans un groupe
   * @Endpoint : groups/{id}/invite
   * @Method : POST
   */
  inviteGroup () {
    this.app.post('/groups/:id/invite', (req, res) => {
      try {
        this.GroupModel.findById(req.params.id)
          .then(group => {
            const _members = group.members
            const _userId = (req.body.id_receiver) ? req.body.id_receiver : false
            if (_members.includes(_userId) || _members.includes(_userId)) {
              res.status(400).json(
                {
                  error: {
                    status: 400,
                    message: 'user already in this group'
                  }
                }
              )
            } else {
              const InvitationModel = new this.InvitationModel(req.body)
              this.InvitationModel.findOne({
                type: 'group',
                id_destination: req.params.id,
                id_receiver: _userId
              }, function (res, user) {
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
                  InvitationModel.save().then(invitation => {
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
   * Rejoindre un groupe
   * @Endpoint : /groups/{id}/join
   * @Method : PUT
   */
  joinGroup () {
    this.app.put('/groups/:id/join', (req, res) => {
      try {
        this.GroupModel.findById(req.params.id)
          .then(group => {
            const _managers = group.managers
            const _members = group.members
            const _userId = (req.body.user_id) ? req.body.user_id : false
            const _role = (req.body.manager) ? 'manager' : 'member'
            let _access = (group.group_type === 'public') ? 1 : 0
            if (_access) {
              if (_managers.includes(_userId) || _members.includes(_userId)) {
                res.status(400).json(
                  {
                    error: {
                      status: 400,
                      message: 'user already in this group'
                    }
                  }
                )
              } else {
                let data
                if (_role === 'member') {
                  _members.push(_userId)
                  data = {members: _members}
                } else if (_role === 'manager') {
                  _managers.push(_userId)
                  data = {managers: _managers}
                }
                this.GroupModel.findByIdAndUpdate(req.params.id, data).populate('managers, members').then(group => {
                  res.status(201).json(
                    {
                      group: group
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
            } else {
              this.InvitationModel.findOneAndUpdate({
                type: 'group',
                id_destination: req.params.id,
                id_receiver: _userId,
                enable: true
              }, {enable: false, date_end: Date.now()}).populate('id_receiver').then(invitation => {
                console.log(invitation)
                let data
                if (_role === 'member') {
                  _members.push(_userId)
                  data = {members: _members}
                } else if (_role === 'manager') {
                  _managers.push(_userId)
                  data = {managers: _managers}
                }
                if (invitation) {
                  this.GroupModel.findByIdAndUpdate(req.params.id, data).populate('managers, members').then(group => {
                    res.status(201).json(
                      {
                        group: group
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
                } else {
                  console.log('as')
                  res.status(400).json(
                    {
                      error: {
                        status: 400,
                        message: 'Failed to connect to this group'
                      }
                    }
                  )
                }
              }).catch(src => {
                console.log(res)
                res.status(400).json(
                  {
                    error: {
                      status: 400,
                      message: 'Failed to connect to this group'
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
   * Quitter un groupe
   * @Endpoint : /groups/{id}/leave
   * @Method : PUT
   */
  leaveGroup () {
    this.app.put('/groups/:id/leave', (req, res) => {
      try {
        this.GroupModel.findById(req.params.id).populate('managers, members').then(group => {
          const _managers = group.managers
          const _members = group.members
          const _userId = (req.body.user_id) ? req.body.user_id : false
          const _role = (req.body.manager) ? 'manager' : 'member'
          let data
          if (_role === 'member') {
            if (_members.includes(_userId)) {
              _members.splice(_members.indexOf(_userId), 1)
              data = {members: _members}
              this.GroupModel.findByIdAndUpdate(req.params.id, data).populate('managers, members').then(group => {
                res.status(201).json(
                  {
                    group: group
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
            } else {
              res.status(400).json(
                {
                  error: {
                    status: 400,
                    message: 'user not in this group'
                  }
                }
              )
            }
          } else if (_role === 'manager') {
            if (_managers.includes(_userId)) {
              _managers.splice(_managers.indexOf(_userId), 1)
              data = {managers: _managers}
              this.GroupModel.findByIdAndUpdate(req.params.id, data).populate('managers, members').then(group => {
                res.status(201).json(
                  {
                    group: group
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
            } else {
              res.status(400).json(
                {
                  error: {
                    status: 400,
                    message: 'user not in this group'
                  }
                }
              )
            }
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
   * @Endpoint : /groups
   * @Method : GET
   */
  getGroups () {
    this.app.get('/groups', (req, res) => {
      try {
        this.GroupModel.find({}, function (res, groups) {
          res.status(200).json(
            {
              groups: groups
            }
          )
        }).populate('managers, members')
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }

  /**
   * Récupérer les données d'un group
   * @Endpoint : /groups/{id}
   * @Method : GET
   */
  getGroup () {
    this.app.get('/groups/:id', (req, res) => {
      try {
        this.GroupModel.findById(req.params.id).populate('managers, members').then(group => {
          if (group) {
            res.status(200).json(
              {
                group: group
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
