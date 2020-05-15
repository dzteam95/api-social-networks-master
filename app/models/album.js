const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  album_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  path: String,
  title: String,
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateCreation: Date,
  statut: { type: Boolean, default: 1 }
}, {
  collection: 'albums_pictures',
  minimize: false,
  versionKey: false 
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
  }
}) 

module.exports = Schema
