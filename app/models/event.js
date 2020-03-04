const mongoose = require('mongoose')

const Schema = new mongoose.Schema({

  name: String,
  Description: String,
  Date_debut: String,
  Date_de_fin: String,
  Lieu: String,
  statut: String,
  image_event: {
    type: String,
    default: 'https://pbs.twimg.com/profile_images/1126137112825335808/L5WvNz8W_400x400.jpg'
  }
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
