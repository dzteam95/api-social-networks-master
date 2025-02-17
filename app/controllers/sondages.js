const sondagesModel = require('../models/sondages')
const sondagesQuestionModel = require('../models/questions')
const sondagesQuestionResponsesModel = require('../models/questions_reponses')
const sondagesResponsesModel = require('../models/reponses')
const EventModel = require('../models/events')

/**
 * Sondages
 * @class
 */

class Sondages {
  constructor (app, connect) {
    this.app = app
    this.sondagesModel = connect.model('sondage', sondagesModel)
    this.sondagesQuestionModel = connect.model('sondageQuestion', sondagesQuestionModel)
    this.sondagesQuestionResponsesModel = connect.model('sondageQuestionResponse', sondagesQuestionResponsesModel)
    this.sondagesResponsesModel = connect.model('sondageResponse', sondagesResponsesModel)
    this.EventModel = connect.model('Event', EventModel)
    this.getSondages()
    this.getSondage()
    this.createSondage()
    this.updateSondage()
    this.deleteSondage()
    this.deleteSondageQuestion()
    this.getSondageQuestions()
    this.deleteSondageQuestionResponse()
    this.getSondageQuestionsAnswers()
    this.createResponse()
  }
  
  /**
   * Récupérer tout les sondages
   * @Endpoint : /sondage
   * @Method : GET
   */
  
  getSondages () {
    this.app.get('/sondages', (req, res) => {
      try {
        this.sondagesModel.find({}, function (res, sondages) {
          res.status(200).json(
            {
              sondages: sondages
            }
          )
        }).populate('author_id')
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
  
  /**
   * Récupérer les données d'un sondage
   * @Endpoint : /sondage/{id}
   * @Method : GET
   */
  
  getSondage () {
    this.app.get('/sondage/:id', (req, res) => {
      try {
        this.sondagesModel.findById(req.params.id).populate('author_id').then(sondage => {
          if (sondage) {
            res.status(200).json(
              {
                sondage: sondage
              }
            )
          } else {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'invalid id'
                }
              }
            )
          }
        }).catch(res => {
          res.status(400).json(
            {
              error: {
                status: 400,
                message: 'invalid id'
              }
            }
          )
        })
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
  
  /**
   * Récupérer les questions d'un sondage
   * @Endpoint : /sondage/{id}/questions
   * @Method : GET
   */
  
  getSondageQuestions () {
    this.app.get('/sondages/:id/questions', (req, res) => {
      try {
        this.sondagesModel.findById(req.params.id).populate('author_id').then(sondage => {
          if (sondage) {
            this.sondagesQuestionModel.find({'sondage_ref': req.params.id}).populate('sondage_ref').then(SondageQuestion => {
              res.status(200).json(
                {
                  SondageQuestion: SondageQuestion
                }
              )
            })
          } else {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'invalid id'
                }
              }
            )
          }
        }).catch(res => {
          res.status(400).json(
            {
              error: {
                status: 400,
                message: 'invalid id'
              }
            }
          )
        })
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
  
  /**
   * Récupérer les questions d'un sondage
   * @Endpoint : /sondage/{id}/questions/{question_id}/reponses
   * @Method : GET
   */
  getSondageQuestionsAnswers () {
    this.app.get('/sondage/:id/questions/:question_id/responses', (req, res) => {
      try {
        this.sondagesQuestionModel.findById(req.params.questionId).populate('sondage_ref').then(sondage => {
          if (sondage) {
            this.sondagesQuestionAResponsesModel.find({'question_ref': req.params.questionId}).populate('sondage_ref, question_ref').then(questionReponses => {
              res.status(200).json(
                {
                  questionReponses: questionReponses
                }
              )
            })
          } else {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'invalid id'
                }
              }
            )
          }
        }).catch(res => {
          res.status(400).json(
            {
              error: {
                status: 400,
                message: 'invalid id'
              }
            }
          )
        })
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
  
  /**
   * Créer un sondage
   * @Endpoint : /sondage/create
   * @Method : POST
   */
  
  createSondage () {
    this.app.post('/sondage/create', (req, res) => {
      try {
        const SondagesModel = new this.SondagesModel(req.body)
        this.EventModel.findOne({ admins: {'$in': [req.body.author_id]} }, function (res, event) {
          if (event) {
            SondagesModel.save().then(sondage => {
              res.status(201).json(
                {
                  sondage: sondage
                }
              )
            }).catch(res => {
              res.status(400).json(
                {
                  error: {
                    status: 400,
                    message: 'error'
                  }
                }
              )
            })
          } else {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'author_id is not a manager'
                }
              }
            )
          }
        }).populate('admins, members')
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
  
  /**
   * Créer une question dans un sondage
   * @Endpoint : /sondage/{id}/questions/create
   * @Method : POST
   */
  
  deleteSondageQuestion () {
    this.app.post('/sondage/:id/questions/create', (req, res) => {
      try {
        const SondagesQuestionModel = new this.SondagesQuestionModel(req.body)
        this.sondagesModel.findById(req.params.id, function (res, sondage) {
          if (sondage) {
            SondagesQuestionModel.save().then(questions => {
              res.status(201).json(
                {
                  questions: questions
                }
              )
            }).catch(res => {
              res.status(400).json(
                {
                  error: {
                    status: 400,
                    message: 'error'
                  }
                }
              )
            })
          } else {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'sondage doesnt exist'
                }
              }
            )
          }
        }).populate('author_id')
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
  
  /**
   * Créer une réponse possible d'une question dans un sondage
   * @Endpoint : /sondage/{id}/questions/{question_id}/answer/create
   * @Method : POST
   */
  
  deleteSondageQuestionResponse () {
    this.app.post('/sondage/:id/questions/:question_id/answer/create', (req, res) => {
      try {
        const sondagesQuestionResponsesModel = new this.SondagesQuestionResponsesModel(req.body)
        this.SondagesQuestionModel.findById(req.params.question_id, function (res, sondageQuestion) {
          if (sondageQuestion) {
            sondagesQuestionResponsesModel.save().then(sondageQuestion => {
              res.status(201).json(
                {
                  sondageQuestion: sondageQuestion
                }
              )
            }).catch(res => {
              res.status(400).json(
                {
                  error: {
                    status: 400,
                    message: 'error'
                  }
                }
              )
            })
          } else {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'question doesnt exist'
                }
              }
            )
          }
        }).populate('sondage_ref')
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
  
  /**
   * Créer une réponse a une question dans un sondage
   * @Endpoint : /sondages/{id}/questions/{question_id}/responses/define
   * @Method : POST
   */
  createResponse () {
    this.app.post('/sondages/:id/questions/:question_id/responses/define', (req, res) => {
      try {
        const SondagesModel = new this.SondagesModel(req.body)
        const SondagesQuestionModel = new this.SondagesQuestionModel(req.body)
        const SondagesQuestionResponsesModel = new this.SondagesQuestionResponsesModel(req.body)
        const SondagesResponseModel = new this.SondagesResponseModel(req.body)
        SondagesModel.findById(req.params.id, function (res, sondage) {
          if (sondage) {
            SondagesQuestionModel.findById(req.params.question_id, function (res, question) {
              if (question) {
                SondagesQuestionResponsesModel.findOne({'content': req.body.questions, 'sondage_ref': req.params.id, 'question_ref': req.params.questionId}, function (res, question) {
                  if (question) {
                    SondagesResponseModel.save().then(response => {
                      res.status(201).json(
                        {
                          response: response
                        }
                      )
                    }).catch(res => {
                      res.status(400).json(
                        {
                          error: {
                            status: 400,
                            message: 'error'
                          }
                        }
                      )
                    })
                  } else {
                    res.status(400).json(
                      {
                        error: {
                          status: 400,
                          message: 'answer doesnt exist'
                        }
                      }
                    )
                  }
                }).populate('sondage_ref, question_ref')
              } else {
                res.status(400).json(
                  {
                    error: {
                      status: 400,
                      message: 'question_poll doesnt exist'
                    }
                  }
                )
              }
            }).populate('sondage_ref')
          } else {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'sondage doesnt exist'
                }
              }
            )
          }
        }).populate('author_id')
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
  
  /**
   * Editer un sondage
   * @Endpoint : /sondages/{id}/update
   * @Method : PUT
   */
  
  updateSondage () {
    this.app.put('/sondages/:id/update', (req, res) => {
      try {
        this.sondagesModel.findByIdAndUpdate(req.params.id, req.body).populate('author_id').then(sondage => {
          if (sondage) {
            res.status(201).json(
              {
                sondage: sondage
              }
            )
          } else {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'invalid id'
                }
              }
            )
          }
        }).catch(res => {
          res.status(400).json(
            {
              error: {
                status: 400,
                message: 'invalid id'
              }
            }
          )
        })
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
  
  /**
   * Supprimer un sondage
   * @Endpoint : /sondages/{id}/delete
   * @Method : DELETE
   */
  deleteSondage () {
    this.app.delete('/sondages/:id/delete', (req, res) => {
      try {
        this.sondagesModel.findByIdAndDelete(req.params.id).populate('author_id').then(sondage => {
          if (sondage) {
            res.status(200).json(
              {
                success: {
                  status: 200,
                  message: 'successfully deleted'
                }
              }
            )
          } else {
            res.status(400).json(
              {
                error: {
                  status: 400,
                  message: 'invalid id'
                }
              }
            )
          }
        }).catch(res => {
          res.status(400).json(
            {
              error: {
                status: 400,
                message: 'invalid id'
              }
            }
          )
        })
      } catch (err) {
        res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        })
      }
    })
  }
}

module.exports = Sondages
