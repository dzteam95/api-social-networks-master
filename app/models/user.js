const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  age: Number,
  city: String,
  city_code: String,
  street_number: String,
  street_type: String,
  street_name: String,
  phone: String,
  image_profil: {
    type: String,
    default: 'https://pbs.twimg.com/profile_images/1126137112825335808/L5WvNz8W_400x400.jpg'
  }
}, {
  collection: 'users',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id

    delete ret._id
  }
})

module.exports = Schema
