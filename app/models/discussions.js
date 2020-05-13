const mongoose = require('mongoose')

const Schema = new mongoose.Schema({

  name: String,
  Description: Date,
  statut: { type: Boolean, default: 1 }

}, {
  collection: 'discussions',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id

    delete ret._id
  }
})

module.exports = Schema 