const mongoose = require('mongoose')

const Schema = new mongoose.Schema({

  name: String,
  Description: String,
  Date_debut: String,
  Date_de_fin: String,
  Lieu: String,
  prive: {type: Boolean, default: 1},
  managers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  statut: {type: Boolean, default: 1},

}, {
  collection: 'events',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id

    delete ret._id
  }
})

module.exports = Schema
