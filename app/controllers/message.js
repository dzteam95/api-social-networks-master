const MessageModel = require('../models/messages')
const CommentModel = require('../models/comments')

/**
 * Message
 * @class
 */

module.exports = class Message {
  constructor (app, connect) {
    this.app = app
    this.MessageModel = connect.model('Message', MessageModel)
    this.CommentModel = connect.model('Comment', CommentModel)
    this.getMessages()
    this.getMessage()
    this.getMessagesComments()
    this.createMessage()
    this.updateMessage()
    this.deleteMessage()
  }
  
  /**
   * Récupérer tout les messages
   * @Endpoint : /messages
   * @Method : GET
   */
  getMessages () {
    this.app.get('/messages', (req, res) => {
      try {
        this.MessageModel.find({}, function (res, messages) {
          res.status(200).json(
            {
              messages: messages
            }
          )
        }).populate('author_id, discussion_ref')
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
  
  /**
   * Récupérer les données d'un message
   * @Endpoint : /messages/{id}
   * @Method : GET
   */
  getMessage () {
    this.app.get('/messages/:id', (req, res) => {
      try {
        this.MessageModel.findById(req.params.id).populate('author_id discussion_ref').then(message => {
          if (message) {
            res.status(200).json(
              {
                message: message
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
   * Récupérer les commentaires d'un messages
   * @Endpoint : /messages/{id}/comments
   * @Method : GET
   */
  getMessagesComments () {
    this.app.get('/messages/:id/comments', (req, res) => {
      try {
        this.MessageModel.findById(req.params.id).populate('author_id, discussion_ref').then(message => {
          if (message) {
            this.CommentModel.find({'ref': req.params.id, 'type': 'group_message'}).populate('author_id').then(comments => {
              res.status(200).json(
                {
                  comments: comments
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
   * Créer un message
   * @Endpoint : /messages/create
   * @Method : POST
   */
  createMessage () {
    this.app.post('/messages/create', (req, res) => {
      try {
        const messageModel = new this.MessageModel(req.body)
        messageModel.save().then(message => {
          res.status(201).json(
            {
              message: message
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
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
  
  /**
   * Editer un message
   * @Endpoint : /messages/{id}/update
   * @Method : PUT
   */
  updateMessage () {
    this.app.put('/messages/:id/update', (req, res) => {
      try {
        this.MessageModel.findByIdAndUpdate(req.params.id, req.body).populate('author_id, discussion_ref').then(message => {
          if (message) {
            res.status(201).json(
              {
                message: message
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
   * Supprimer un message
   * @Endpoint : /messages/{id}/delete
   * @Method : DELETE
   */
  deleteMessage () {
    this.app.delete('/messages/:id/delete', (req, res) => {
      try {
        this.MessageModel.findByIdAndDelete(req.params.id).populate('author_id, discussion_ref').then(message => {
          if (message) {
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
