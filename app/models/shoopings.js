const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  billet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'billet',
    required: true,
    unique: true
  },
  quantity: Number,
  hour: Date,
  dateCreation: Date,
  statut: { type: Boolean, default: 1 }
}, {
  collection: 'shoopings',
  minimize: false,
  versionKey: false 
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
  }
})

module.exports = Schema
