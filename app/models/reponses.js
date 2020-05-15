const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    
  },
  reponse: String,
  sondage_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sondages'
    
  },
  question_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SondageQuestion'
    
  },
  status: {type: Boolean, default: 1}
}, {
  collection: 'Sondages_reponses',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
  }
})

module.exports = Schema
