const CommentModel = require('../models/comments')

/**
 * Comment
 * @class
 */

module.exports = class Comment {
  constructor (app, connect) {
    this.app = app
    this.CommentModel = connect.model('Comment', CommentModel)
    this.createComment()
    this.getComments()
    this.getComment()
    this.updateComment()
    this.deleteComment()
  }

  /**
   * Créer un commentaire
   * @Endpoint : /comments/create
   * @Method : POST
   */
  createComment () {
    this.app.post('/comments/create', (req, res) => {
      try {
        const commentModel = new this.CommentModel(req.body)
        commentModel.save().then(comment => {
          res.status(201).json(
            {
              comment: comment
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
   * Récupérer tout les commentaires
   * @Endpoint : /comments
   * @Method : GET
   */
  getComments () {
    this.app.get('/comments', (req, res) => {
      try {
        this.CommentModel.find({}, function (res, comments) {
          res.status(200).json(
            {
              comments: comments
            }
          )
        }).populate('author_id')
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }

  /**
   * Récupérer les données d'un commentaire
   * @Endpoint : /comments/{id}
   * @Method : GET
   */
  getComment () {
    this.app.get('/comments/:id', (req, res) => {
      try {
        this.CommentModel.findById(req.params.id).populate('author_id').then(comment => {
          if (comment) {
            res.status(200).json(
              {
                comment: comment
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
   * Editer un commentaire
   * @Endpoint : /comments/{id}/update
   * @Method : PUT
   */
  updateComment () {
    this.app.put('/comments/:id/update', (req, res) => {
      try {
        this.CommentModel.findByIdAndUpdate(req.params.id, req.body).populate('author_id').then(comment => {
          if (comment) {
            res.status(201).json(
              {
                comment: comment
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
   * Supprimer un commentaire
   * @Endpoint : /comments/{id}/delete
   * @Method : DELETE
   */
  deleteComment () {
    this.app.delete('/comments/:id/delete', (req, res) => {
      try {
        this.CommentModel.findByIdAndDelete(req.params.id).populate('author_id').then(comment => {
          if (comment) {
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
