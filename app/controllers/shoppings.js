const EventModel = require('../models/events')
const BilletModel = require('../models/billet')
const ShoppingsModel = require('../models/shoopings')

/**
 * Shopping
 * @class
 */

module.exports = class Shopping {
  constructor (app, connect) {
    this.app = app
    this.EventModel = connect.model('Event', EventModel)
    this.BilletModel = connect.model('billet', BilletModel)
    this.ShoppingsModel = connect.model('Shoopings', ShoppingsModel)
    this.createShoppingList()
    this.deleteShoppingList()
    this.createBillet()
    this.getBillet()
    this.getShopping()
    this.updateBillet()
    this.deleteBillet()
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
        this.EventModel.findByIdAndUpdate(req.body.event_id, {'shopping_list': true}).populate('managers, members').then(event => {
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
   * Créer un item dans une shopping list
   * @Endpoint : /shoppings/items/create
   * @Method : POST
   */
  
  createBillet () {
    this.app.post('/Billet/items/create', (req, res) => {
      try {
        const shoppingItemsModel = new this.ShoppingItemsModel(req.body)
        this.EventModel.findById(req.body.event_id, function (res, event) {
          if (event) {
            shoppingItemsModel.save().then(items => {
              res.status(201).json(
                {
                  items: items
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
   * Récupérer les items d'une shopping list
   * @Endpoint : /shoppings/{id}/items
   * @Method : GET
   */
  
  getBillet () {
    this.app.get('/shoppings/:id/items', (req, res) => {
      try {
        this.EventModel.findById(req.params.id).populate('managers, members').then(event => {
          if (event) {
            this.ShoppingItemsModel.find({'event_id': req.params.id}).populate('event_id').then(shoppingList => {
              res.status(200).json(
                {
                  shoppingList: shoppingList
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
   * Récupérer les items réservés d'une shopping list
   * @Endpoint : /shoppings/{id}/items/shoppers
   * @Method : GET
   */
  
  getShopping () {
    this.app.get('/shoppings/:id/items/shoppings', (req, res) => {
      try {
        this.EventModel.findById(req.params.id).populate('managers, members').then(event => {
          if (event) {
            this.ShoppersModel.find({'event_id': req.params.id, 'enable': true}).populate('event_id').then(shoppingList => {
              res.status(200).json(
                {
                  shoppingList: shoppingList
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
   * Editer un billet d'une shopping list
   * @Endpoint : /billet/{id}/update
   * @Method : PUT
   */
  
  updateBillet () {
    this.app.put('/billet/:id/update', (req, res) => {
      try {
        this.ShoppingItemsModel.findByIdAndUpdate(req.params.id, req.body).then(item => {
          if (item) {
            res.status(201).json(
              {
                item: item
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
   * Supprimer un billet d'une shopping list
   * @Endpoint : /billet/{id}/delete
   * @Method : DELETE
   */
  
  deleteBillet () {
    this.app.delete('/billet/:id/delete', (req, res) => {
      try {
        this.ShoppingItemsModel.findByIdAndDelete(req.params.id).then(item => {
          if (item) {
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
        this.EventModel.findByIdAndUpdate(req.body.event_id, {'shopping_list': false}).populate('managers, members').then(event => {
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
   * Définir un billet sur un utilisateur (le bloque)
   * @Endpoint : /billet/{id}/shoppings/define/{user_id}
   * @Method : POST
   */
  
  defineShopping () {
    this.app.post('/billet/:id/shoppings/define/:user_id', (req, res) => {
      try {
        const shoppersModel = new this.ShoppersModel(req.body)
        this.ShoppingItemsModel.findById(req.params.id, function (res, item) {
          if (item) {
            shoppersModel.save().then(shopperItem => {
              res.status(201).json(
                {
                  shopperItem: shopperItem
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
                  message: 'Item doesnt exist'
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
   * Supprime un utilisateur sur un item d'une shopping list
   * @Endpoint : /billet/{id}/shoppings/remove
   * @Method : POST
   */
  removeShopping () {
    this.app.post('/billet/:id/shoppings/remove', (req, res) => {
      try {
        this.ShoppersModel.deleteOne({'item_id': req.params.id}).then(shopperItem => {
          if (shopperItem) {
            res.status(201).json(
              {
                shopperItem: shopperItem
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
