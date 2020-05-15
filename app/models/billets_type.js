const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  name: String,
  price: Number,
  quantity: Number,
  date_creation: Date,
  status: {type: Boolean, default: 1}
}, {
  collection: 'billet_type',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
  }
})

module.exports = Schema
