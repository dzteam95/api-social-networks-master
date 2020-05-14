const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  type: String,
  id_destination: String,
  role: {type: String, default: 'member', required: true},
  id_receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  id_sender: String,
  date_begin: Date,
  date_end: Date,
  statut: { type: Boolean, default: 1 }
}, {
  collection: 'invitations',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
  }
})

module.exports = Schema