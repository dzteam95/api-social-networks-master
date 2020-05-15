const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  content: { type: String, required: true },
  sondage_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sondages'
    
  },
  status: {type: Boolean, default: 1}
}, {
  collection: 'Sondages_questions',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
  }
})

module.exports = Schema
