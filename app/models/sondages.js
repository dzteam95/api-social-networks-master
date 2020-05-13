const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  titre: String,
  Description: String,
  DateCreation: Date,
  DateFin: Date,
  statut: { type: Boolean, default: 1, required: true }
}, {
  collection: 'sondages',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id

    delete ret._id
  }
})

module.exports = Schema