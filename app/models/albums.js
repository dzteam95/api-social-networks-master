const mongoose = require('mongoose')

const Schema = new mongoose.Schema({

  name: String,
  Description: String,
  DateCreation: Date,
  statut: Boolean
}, {
  collection: 'albums',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
  } 
})

module.exports = Schema
