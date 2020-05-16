const mongoose = require('mongoose')

const Schema = new mongoose.Schema({

  name: String,
  Description: String,
  date_creation: Date,
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  permissions: {
    member_publish: {type: Boolean, default: true, required: true},
    member_create_event: {type: Boolean, default: false, required: true}
  },
  icone_group: {
    type: String,
    default: 'https://pbs.twimg.com/profile_images/1126137112825335808/L5WvNz8W_400x400.jpg'
  },
  image_group: {
    type: String,
    default: 'https://pbs.twimg.com/profile_images/1126137112825335808/L5WvNz8W_400x400.jpg'
  },
  status: Boolean
}, {
  collection: 'groups',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id

    delete ret._id
  }
})

module.exports = Schema
