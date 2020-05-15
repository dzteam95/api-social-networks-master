const EventModel = require('../models/events')
const ShoppingsModel = require('../models/shoopings')

/**
 * Shopping
 * @class
 */

module.exports = class Shopping {
  constructor (app, connect) {
    this.app = app
    this.EventModel = connect.model('Event', EventModel)
    this.ShoppingsModel = connect.model('Shoopings', ShoppingsModel)
    this.createShoppingList()
    this.deleteShoppingList()
    this.createArticl()
    this.getArticl()
    this.getShopping()
    this.updateArticl()
    this.deleteArticl()
    this.defineShopping()
    this.removeShopping()
  }
  
  /**
   * Créer une shopping list
   * @Endpoint : /shoppings/create
   * @Method : POST
   */
  createShoppingList () {
    this.app.post('/shoppings/create', (req, res) => {
      try {
        this.EventModel.findByIdAndUpdate(req.body.event_id, {'shopping_list': true}).populate('admins, members').then(event => {
          if (event) {
            res.status(201).json(
              {
                event: event
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
   * Créer un articl dans une shopping list
   * @Endpoint : /shoppings/articl/create
   * @Method : POST
   */
  
  createArticl () {
    this.app.post('/shoppings/Articl/create', (req, res) => {
      try {
        const ShoppingArticlModel = new this.ShoppingArticlModel(req.body)
        this.EventModel.findById(req.body.event_id, function (res, event) {
          if (event) {
            ShoppingArticlModel.save().then(articl => {
              res.status(201).json(
                {
                  articl: articl
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
                  message: 'event doesnt exist'
                }
              }
            )
          }
        }).populate('admins, members')
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
  
  /**
   * Récupérer les articls d'une shopping list
   * @Endpoint : /shoppings/{id}/articl
   * @Method : GET
   */
  
  getArticl () {
    this.app.get('/shoppings/:id/articl', (req, res) => {
      try {
        this.EventModel.findById(req.params.id).populate('admins, members').then(event => {
          if (event) {
            this.shoppingArticlModel.find({'event_id': req.params.id}).populate('event_id').then(shoppingArticl => {
              res.status(200).json(
                {
                  shoppingArticl: shoppingArticl
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
   * Récupérer les articls réservés d'une shopping list
   * @Endpoint : /shoppings/{id}/articl/shoppings
   * @Method : GET
   */
  
  getShopping () {
    this.app.get('/shoppings/:id/articl/shoppings', (req, res) => {
      try {
        this.EventModel.findById(req.params.id).populate('admins, members').then(event => {
          if (event) {
            this.ShoppingsModel.find({'event_id': req.params.id, 'status': true}).populate('event_id').then(shoppingArticl => {
              res.status(200).json(
                {
                  shoppingArticl: shoppingArticl
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
   * Editer un articl d'une shopping list
   * @Endpoint : /articl/{id}/update
   * @Method : PUT
   */
  
  updateArticl () {
    this.app.put('/articl/:id/update', (req, res) => {
      try {
        this.ShoppingArticlModel.findByIdAndUpdate(req.params.id, req.body).then(articl => {
          if (articl) {
            res.status(201).json(
              {
                articl: articl
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
   * Supprimer un articl d'une shopping list
   * @Endpoint : /articl/{id}/delete
   * @Method : DELETE
   */
  
  deleteArticl () {
    this.app.delete('/articl/:id/delete', (req, res) => {
      try {
        this.ShoppingArticlModel.findByIdAndDelete(req.params.id).then(articl => {
          if (articl) {
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
   * Supprime une shopping list
   * @Endpoint : /shoppings/delete
   * @Method : POST
   */
  deleteShoppingList () {
    this.app.post('/shoppings/delete', (req, res) => {
      try {
        this.EventModel.findByIdAndUpdate(req.body.event_id, {'shopping_list': false}).populate('admins, members').then(event => {
          if (event) {
            res.status(201).json(
              {
                event: event
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
   * Définir un articl sur un utilisateur
   * @Endpoint : /articl/{id}/shoppings/define/{user_id}
   * @Method : POST
   */
  
  defineShopping () {
    this.app.post('/articl/:id/shoppings/define/:user_id', (req, res) => {
      try {
        const ShoppingsModel = new this.ShoppingsModel(req.body)
        this.ShoppingArticlModel.findById(req.params.id, function (res, articl) {
          if (articl) {
            ShoppingsModel.save().then(shoppingArticl => {
              res.status(201).json(
                {
                  shoppingArticl: shoppingArticl
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
                  message: 'Articl doesnt exist'
                }
              }
            )
          }
        }).populate('event_id')
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
  
  /**
   * Supprime un utilisateur sur un article d'une shopping list
   * @Endpoint : /articl/{id}/shoppings/remove
   * @Method : POST
   */
  removeShopping () {
    this.app.post('/articl/:id/shoppings/remove', (req, res) => {
      try {
        this.ShoppingsModel.deleteOne({'articl_id': req.params.id}).then(shoppingArticl => {
          if (shoppingArticl) {
            res.status(201).json(
              {
                shoppingArticl: shoppingArticl
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
