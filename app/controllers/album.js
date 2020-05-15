const AlbumModel = require('../models/albums.js')
const AlbumPicturesModel = require('../models/album')
const CommentModel = require('../models/comments')

/**
 * Album
 * @class
 */
module.exports = class Album {
  constructor (app, connect) {
    this.app = app
    this.AlbumModel = connect.model('Album', AlbumModel)
    this.AlbumPicturesModel = connect.model('AlbumPictures', AlbumPicturesModel)
    this.CommentModel = connect.model('Comment', CommentModel)

    this.createAlbum()
    this.getAlbums()
    this.getAlbum()
    this.updateAlbum()
    this.deleteAlbum()
    this.createAlbumPicture()
    this.updateAlbumPicture()
    this.deleteAlbumPicture()
    this.getAlbumPictures()
    this.getAlbumPicturesComments()
  }

  /**
   * Create
   */

  createAlbum () {
    this.app.post('/albums/create', (req, res) => {
      try {
        const albumModel = this.AlbumModel(req.body)
        this.AlbumModel.findOne({ title: req.body.title }, function (res, album) {
          if (album) {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'album already exist'
                }
              }
            )
          } else {
            albumModel.save().then(album => {
              res.status(201).json(
                {
                  album: album
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
   * Récupérer les données des albums
    @Endpoint : /album
    @Method : GET
   */

  getAlbums () {
    this.app.get('/albums', (req, res) => {
      try {
        this.AlbumModel.find({}, function (res, albums) {
          res.status(200).json(
            {
              albums: albums,
              totalAlbums: Object.keys(albums).length
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
   * Récupérer les données d'un album
   * @Endpoint : /album/{id}
   * @Method : GET
   */
  getAlbum () {
    this.app.get('/albums/:id', (req, res) => {
      try {
        this.AlbumModel.findById(req.params.id).then(album => {
          if (album) {
            res.status(200).json(
              {
                album: album
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
   * Update les données d'un album
   * @Endpoint : /album/{id}/update
   * @Method : PUT
   */
  updateAlbum () {
    this.app.put('/albums/:id/update', (req, res) => {
      try {
        this.AlbumModel.findByIdAndUpdate(req.params.id, req.body).populate('event_ref').then(album => {
          if (album) {
            res.status(201).json(
              {
                album: album
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
     * Supprimer un album
     */
  deleteAlbum () {
    this.app.delete('/albums/:id/delete', (req, res) => {
      try {
        this.AlbumModel.findByIdAndDelete(req.params.id).populate('event_ref').then(album => {
          if (album) {
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

  /**
     * Créer une image dans un album
     */
  createAlbumPicture () {
    this.app.post('/albums/:id/pictures/create', (req, res) => {
      try {
        const albumPicturesModel = new this.AlbumPicturesModel(req.body)

        albumPicturesModel.save().then(album => {
          res.status(201).json(
            {
              album: album
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
   * Récupérer les images d'un album
   */

  getAlbumPictures () {
    this.app.get('/albums/:id/pictures', (req, res) => {
      try {
        this.AlbumModel.findById(req.params.id).populate('event_ref').then(albums => {
          if (albums) {
            this.AlbumPicturesModel.find({'album_ref': req.params.id}).populate('album_ref, author_id').then(pictures => {
              res.status(200).json(
                {
                  pictures: pictures
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
 * Récupérer les commentaires d'une image dans un album
 */
  getAlbumPicturesComments () {
    this.app.get('/albums/:id/pictures/:pic_id/comments', (req, res) => {
      try {
        this.AlbumPicturesModel.find({'album_ref': req.params.id}).populate('event_ref').then(picture => {
          if (picture) {
            this.CommentModel.find({'ref': req.params.pic_id, 'type': 'album'}).populate('author_id').then(comments => {
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
     * Editer une image d'un album
     */
  updateAlbumPicture () {
    this.app.put('/albums/:id/pictures/update', (req, res) => {
      try {
        this.AlbumPicturesModel.findByIdAndUpdate(req.params.id, req.body).populate('album_ref, author_id').then(picture => {
          if (picture) {
            res.status(201).json(
              {
                picture: picture
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
     * Supprimer une image d'un album
     */
  deleteAlbumPicture () {
    this.app.delete('/albums/:id/pictures/delete', (req, res) => {
      try {
        this.AlbumPicturesModel.findByIdAndDelete(req.params.id).populate('album_ref, author_id').then(picture => {
          if (picture) {
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
