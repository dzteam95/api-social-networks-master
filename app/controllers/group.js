const GroupModel = require('../models/group')
const InvitationModel = require('../models/invitations')


/**
 * Group
 * @class
 */
class Group {
  constructor (app, connect) {
    this.app = app
    this.GroupModel = connect.model('Group', GroupModel)
    this.InvitationModel = connect.model('Invitation', InvitationModel)


    this.createGroup()
    this.inviteGroup()
    this.joinGroup()
    this.getGroups()
    this.getGroup()
    this.leaveGroup()
    this.updateGroup()
    this.deleteGroup()
  }

  /**
   * Create
   */
  createGroup () {
    this.app.post('/groups/create', (req, res) => {
        try {
            const GroupModel = new this.GroupModel(req.body)
            
            if(req.body.managers && req.body.managers[0]){
                if(req.body.group_type && (req.body.group_type == 'public' || req.body.group_type == 'private' || req.body.group_type == 'secret')){
                    GroupModel.save().then(group => {
                        res.status(201).json(
                            { 
                                group: group, 
                            }
                        )
                    }).catch(err => {
                        res.status(400).json(
                            { 
                                error: {
                                    status: 400,
                                    message: "error",
                                } 
                            }
                        ) 
                    })
                }else{
                    res.status(400).json(
                        { 
                            error: {
                                status: 400,
                                message: "Group_type not accepted (public, private, secret)",
                            } 
                        }
                    ) 
                }
            }else{
                res.status(400).json(
                    { 
                        error: {
                            status: 400,
                            message: "Owner is not defined",
                        } 
                    }
                ) 
            }
             
        } catch {
            res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
        }
    })

     /**
     * Inviter dans un groupe
     * @Endpoint : groups/{id}/invite
     * @Method : POST
     */

    invite_group() {
        this.app.post('/groups/:id/invite', (req, res) => {
            try {
                this.GroupModel.findById(req.params.id)
                .then(group => {
                    const _managers = group.managers;
                    const _members = group.members;
                    const _user_id = (req.body.id_receiver) ? req.body.id_receiver : false;
                    const _role = (req.body.manager) ? "manager" : "member";
                    
                    if(_managers.includes(_user_id) || _members.includes(_user_id)){
                        res.status(400).json(
                            { 
                                error: {
                                    status: 400,
                                    message: "user already in this group",
                                } 
                            }
                        ) 
                    }else{
                        const InvitationModel = new this.InvitationModel(req.body)

                        this.InvitationModel.findOne({ type: "group", id_destination: req.params.id, id_receiver: _user_id }, function(err, user) {
                            if (user) {
                                res.status(400).json(
                                    { 
                                        error: {
                                            status: 400,
                                            message: "invitation already exist",
                                        } 
                                    }
                                ) 
                            } else {
                                InvitationModel.save().then(invitation => {
                                    res.status(201).json(
                                        { 
                                            invitation: invitation, 
                                        }
                                    )
                                }).catch(err => {
                                    res.status(400).json(
                                        { 
                                            error: {
                                                status: 400,
                                                message: "error",
                                            } 
                                        }
                                    ) 
                                })
                            }
                        }).populate('id_receiver'); 
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
     * Rejoindre un groupe
     * @Endpoint : /groups/{id}/join
     * @Method : PUT
     */
    join_group() {
        this.app.put('/groups/:id/join', (req, res) => {
            try {
                this.GroupModel.findById(req.params.id)
                .then(group => {
                    const _managers = group.managers;
                    const _members = group.members;
                    const _user_id = (req.body.user_id) ? req.body.user_id : false;
                    const _role = (req.body.manager) ? "manager" : "member";
                    let _access = (group.group_type == 'public') ? true : false;

                    if(_access){
                        if(_managers.includes(_user_id) || _members.includes(_user_id)){
                            res.status(400).json(
                                { 
                                    error: {
                                        status: 400,
                                        message: "user already in this group",
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
                            
                            this.GroupModel.findByIdAndUpdate(req.params.id, data).populate('managers, members').then(group => {
                                res.status(201).json(
                                    { 
                                        group: group, 
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
                    }else{
                        this.InvitationModel.findOneAndUpdate({ type: "group", id_destination: req.params.id, id_receiver: _user_id, enable: true}, {enable: false, date_end: Date.now()}).populate('id_receiver').then(invitation => {
                            console.log(invitation);
                            let data;
                            if(_role == "member"){
                                _members.push(_user_id)
                                data = {members : _members}
                            }else if(_role == "manager"){
                                _managers.push(_user_id)
                                data = {managers : _managers}
                            }

                            if(invitation){
                                this.GroupModel.findByIdAndUpdate(req.params.id, data).populate('managers, members').then(group => {
                                    res.status(201).json(
                                        { 
                                            group: group, 
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
                            }else{
                                console.log('as');
                                
                                res.status(400).json(
                                    { 
                                        error: {
                                            status: 400,
                                            message: "Failed to connect to this group",
                                        } 
                                    }
                                )
                            }
                        }).catch(err => {
                            console.log(err);
                            
                            res.status(400).json(
                                { 
                                    error: {
                                        status: 400,
                                        message: "Failed to connect to this group",
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
     * Quitter un groupe
     * @Endpoint : /groups/{id}/leave
     * @Method : PUT
     */
    leave_group() {
        this.app.put('/groups/:id/leave', (req, res) => {
            try {
                this.GroupModel.findById(req.params.id).populate('managers, members').then(group => {
                    const _managers = group.managers;
                    const _members = group.members;
                    const _user_id = (req.body.user_id) ? req.body.user_id : false;
                    const _role = (req.body.manager) ? "manager" : "member";
                    let data;
                    
                    if(_role == "member"){
                        if(_members.includes(_user_id)){
                            _members.splice( _members.indexOf( _user_id ), 1 );
                            data = {members : _members}
    
                            this.GroupModel.findByIdAndUpdate(req.params.id, data).populate('managers, members').then(group => {
                                res.status(201).json(
                                    { 
                                        group: group, 
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
                        }else{
                            res.status(400).json(
                                { 
                                    error: {
                                        status: 400,
                                        message: "user not in this group",
                                    } 
                                }
                            ) 
                        }
                    }else if(_role == "manager"){
                        if(_managers.includes(_user_id)){
                            _managers.splice( _managers.indexOf( _user_id ), 1 );
                            data = {managers : _managers}
                            this.GroupModel.findByIdAndUpdate(req.params.id, data).populate('managers, members').then(group => {
                                res.status(201).json(
                                    { 
                                        group: group, 
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
                        }else{
                            res.status(400).json(
                                { 
                                    error: {
                                        status: 400,
                                        message: "user not in this group",
                                    } 
                                }
                            ) 
                        }
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
                    }
                )
            }).populate('managers, members');
            
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
            this.GroupModel.findById(req.params.id).populate('managers, members').then(group => {
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
    this.app.put('/group/:id/update', (req, res) =>       this.app.put('/v1/groups/:id/update', (req, res) => {
        try {
            let _group_type_err = false
            if(req.body.group_type){
                _group_type_err = true
                if(req.body.group_type == 'public' || req.body.group_type == 'private' || req.body.group_type == 'secret'){
                    _group_type_err = false
                }
            }

            if(_group_type_err){
                res.status(400).json(
                    { 
                        error: {
                            status: 400,
                            message: "Group_type not accepted (public, private, secret)",
                        } 
                    }
                ) 
            }else{
                this.GroupModel.findByIdAndUpdate(req.params.id, req.body).populate('managers, members').then(group => {
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
            }
            
        } catch {
            res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
        }
    })
}
    /**
     * Supprimer un groupe
     * @Endpoint : /groups/{id}/delete
     * @Method : DELETE
     */
    delete_group() {
        this.app.delete('/groups/:id/delete', (req, res) => {
            try {
                this.GroupModel.findByIdAndDelete(req.params.id).populate('managers, members').then(group => {
                    
                    if(group){
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

}
module.exports = Group