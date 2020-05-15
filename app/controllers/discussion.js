const DiscussionModel = require('../models/discussions')
const MessageModel = require('../models/messages')

/**
 * Discu
 * @class
 */
module.exports = class Discussion {
  constructor (app, connect) {
    this.app = app
    this.DiscussionModel = connect.model('Discussion', DiscussionModel)
    this.MessageModel = connect.model('Message', MessageModel)
    this.createDiscussion()
    this.getDiscussions()
    this.getDiscussion()
    this.getDiscussionMessages()
    this.updateDiscussion()
    this.deleteDiscussion()
  }

  /**
   * Create
   */
  createDiscussion () {
    this.app.post('/discussions/create', (req, res) => {
      try {
        const discussionModel = new this.DiscussionModel(req.body)
        if (req.body.type && (req.body.type === 'group' || req.body.type === 'event')) {
          discussionModel.save().then(discussion => {
            res.status(201).json(
              {
                discussion: discussion
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
   * Récupérer les données des discussions
   * @Endpoint : /discus
   * @Method : GET
   */
  getDiscussions () {
    this.app.get('/discussions', (req, res) => {
      try {
        this.DiscussionModel.find({}, function (res, discus) {
          res.status(200).json(
            {
              discus: discus,
              totalDiscus: Object.keys(discus).length
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
   * Récupérer les données d'une discusion
   * @Endpoint : /discus/{id}
   * @Method : GET
   */
  getDiscussion () {
    this.app.get('/discussions/:id', (req, res) => {
      try {
        this.DiscussionModel.findById(req.params.id).then(discu => {
          if (discu) {
            res.status(200).json(
              {
                discu: discu
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
   * Récupérer les messages d'une discussion
   */
  getDiscussionMessages () {
    this.app.get('/discussions/:id/messages', (req, res) => {
      try {
        this.DiscussionModel.findById(req.params.id).then(discussion => {
          if (discussion) {
            this.MessageModel.find({'discussion_ref': req.params.id}).populate('author_id, discussion_ref').then(messages => {
              res.status(200).json(
                {
                  messages: messages
                }
              )
            })
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
   * Update les données d'une discussion
   * @Endpoint : /discu/{id}/update
   * @Method : PUT
   */
  updateDiscussion () {
    this.app.put('/discussions/:id/update', (req, res) => {
      try {
        this.DiscussionModel.findByIdAndUpdate(req.params.id, req.body).then(discu => {
          if (discu) {
            res.status(201).json(
              {
                discu: discu
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
   * Supprimer une discussion
   */
  deleteDiscussion () {
    this.app.delete('/discussions/:id/delete', (req, res) => {
      try {
        this.DiscussionModel.findByIdAndDelete(req.params.id).then(discussion => {
          if (discussion) {
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
