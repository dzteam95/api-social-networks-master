const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  type: String,
  author_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  ref: String,
  content: String,
  dateCreation: Date,
  contentModif: String,
  dateModif: Date,
  statut: { type: Boolean, default: 1, required: true }
}, {
  collection: 'comments',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
  }
})

module.exports = Schema