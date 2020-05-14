const sondagesModel = require('../models/sondages')
/*const sondagesQuestionModel = require('../models/sondages_questions')
const sondagesQuestionAnswerModel = require('../models/sondages_questions_answers')
const sondagesAnswerModel = require('../models/sondages_answers')*/
const EventModel = require('../models/events')

/**
 * Sondages
 * @class
 */

class Sondages {
    constructor(app, connect) {
        this.app = app
        this.sondagesModel = connect.model('sondage', sondagesModel)
        this.sondagesQuestionModel = connect.model('sondageQuestion', sondagesQuestionModel)
        this.sondagesQuestionAnswerModel = connect.model('sondageQuestionAnswer', sondagesQuestionAnswerModel)
        this.sondagesAnswerModel = connect.model('sondageAnswer', sondagesAnswerModel)
        this.EventModel = connect.model('Event', EventModel)

        this.getSondages()
        this.getSondage()
        this.createSondage()
        this.updateSondage()
        this.deleteSondage()

        this.deleteSondageQuestion()
        this.getSondage_questions()
        this.deleteSondageQuestion_answer()
        this.getSondage_questions_answers()

        // this.create_answer()
    }

    /**
     * Récupérer tout les sondages
     * @Endpoint : /sondage
     * @Method : GET
     */
    getSondages() {
        this.app.get('/sondages', (req, res) => {
            try {
                this.sondagesModel.find({}, function(err, polls) {
                    res.status(200).json(
                        { 
                            polls: polls, 
                        }
                    )
                }).populate('author_id');
                
            } catch (err) {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }
    
    
    /**
     * Récupérer les données d'un sondage
     * @Endpoint : /sondage/{id}
     * @Method : GET
     */
    getSondage() {
        this.app.get('/sondage/:id', (req, res) => {
            try {
                this.sondagesModel.findById(req.params.id).populate('author_id').then(poll => {
                    if(poll){
                        res.status(200).json(
                            { 
                                poll: poll, 
                            }
                        )
                    }else{
                        res.status(400).json(
                            { 
                                error: {
                                    status: 400,
                                    message: "invalid id",
                                } 
                            }
                        )  
                    }
                    
                }).catch(err => {
                    res.status(400).json(
                        { 
                            error: {
                                status: 400,
                                message: "invalid id",
                            } 
                        }
                    ) 
                });
                
            } catch (err) {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }


    /**
     * Récupérer les questions d'un sondage
     * @Endpoint : /sondage/{id}/questions
     * @Method : GET
     */
    getSondage_questions() {
        this.app.get('/sondages/:id/questions', (req, res) => {
            try {
                this.sondagesModel.findById(req.params.id).populate('author_id').then(poll => {
                    if(poll){
                        
                        this.sondagesQuestionModel.find({"sondage_ref": req.params.id}).populate('sondage_ref').then(poll_quesions => {
                            res.status(200).json(
                                { 
                                    poll_quesions: poll_quesions, 
                                }
                            )
                        });

                    }else{
                        res.status(400).json(
                            { 
                                error: {
                                    status: 400,
                                    message: "invalid id",
                                } 
                            }
                        )  
                    }
                    
                }).catch(err => {
                    res.status(400).json(
                        { 
                            error: {
                                status: 400,
                                message: "invalid id",
                            } 
                        }
                    ) 
                });
                
            } catch (err) {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }
    

    /**
     * Récupérer les questions d'un sondage
     * @Endpoint : /sondage/{id}/questions/{question_id}/answers
     * @Method : GET
     */
    getSondage_questions_answers() {
        this.app.get('/sondage/:id/questions/:question_id/answers', (req, res) => {
            try {
                this.sondagesQuestionModel.findById(req.params.question_id).populate('sondage_ref').then(poll => {
                    if(poll){
                        
                        this.sondagesQuestionAnswerModel.find({"question_ref": req.params.question_id}).populate('sondage_ref, question_ref').then(question_answers => {
                            res.status(200).json(
                                { 
                                    question_answers: question_answers, 
                                }
                            )
                        });

                    }else{
                        res.status(400).json(
                            { 
                                error: {
                                    status: 400,
                                    message: "invalid id",
                                } 
                            }
                        )  
                    }
                    
                }).catch(err => {
                    res.status(400).json(
                        { 
                            error: {
                                status: 400,
                                message: "invalid id",
                            } 
                        }
                    ) 
                });
                
            } catch (err) {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }

    
    /**
     * Créer un sondage
     * @Endpoint : /sondage/create
     * @Method : POST
     */
    createSondage() {
        this.app.post('/sondage/create', (req, res) => {
            try {
                const sondagesModel = new this.sondagesModel(req.body)
                
                this.EventModel.findOne({ managers: { "$in" : [req.body.author_id]} }, function(err, event) {
                    if (event) {
                        
                        sondagesModel.save().then(poll => {
                            res.status(201).json(
                                { 
                                    poll: poll, 
                                }
                            )
                        }).catch(err => {
                            res.status(400).json(
                                { 
                                    error: {
                                        status: 400,
                                        message: "error",
                                    } 
                                }
                            ) 
                        })

                    } else {
                        res.status(400).json(
                            { 
                                error: {
                                    status: 400,
                                    message: "author_id is not a manager",
                                } 
                            }
                        ) 
                    }
                }).populate('managers, members');
                 
            } catch {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }


    /**
     * Créer une question dans un sondage
     * @Endpoint : /sondage/{id}/questions/create
     * @Method : POST
     */
    deleteSondageQuestion() {
        this.app.post('/sondage/:id/questions/create', (req, res) => {
            try {
                const sondagesQuestionModel = new this.sondagesQuestionModel(req.body)
                
                this.sondagesModel.findById(req.params.id, function(err, poll) {
                    if (poll) {
                        
                        sondagesQuestionModel.save().then(questions => {
                            res.status(201).json(
                                { 
                                    questions: questions, 
                                }
                            )
                        }).catch(err => {
                            res.status(400).json(
                                { 
                                    error: {
                                        status: 400,
                                        message: "error",
                                    } 
                                }
                            ) 
                        })

                    } else {
                        res.status(400).json(
                            { 
                                error: {
                                    status: 400,
                                    message: "poll doesnt exist",
                                } 
                            }
                        ) 
                    }
                }).populate('author_id');

            } catch (err) {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }


    /**
     * Créer une réponse possible d'une question dans un sondage
     * @Endpoint : /sondage/{id}/questions/{question_id}/answer/create
     * @Method : POST
     */
    deleteSondageQuestion_answer() {
        this.app.post('/sondage/:id/questions/:question_id/answer/create', (req, res) => {
            try {
                const sondagesQuestionAnswerModel = new this.sondagesQuestionAnswerModel(req.body)
                
                this.sondagesQuestionModel.findById(req.params.question_id, function(err, poll_question) {
                    if (poll_question) {
                        
                        sondagesQuestionAnswerModel.save().then(question_answers => {
                            res.status(201).json(
                                { 
                                    question_answers: question_answers, 
                                }
                            )
                        }).catch(err => {
                            res.status(400).json(
                                { 
                                    error: {
                                        status: 400,
                                        message: "error",
                                    } 
                                }
                            ) 
                        })

                    } else {
                        res.status(400).json(
                            { 
                                error: {
                                    status: 400,
                                    message: "question doesnt exist",
                                } 
                            }
                        ) 
                    }
                }).populate('sondage_ref');

            } catch (err) {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }


    /**
     * Créer une réponse a une question dans un sondage
     * @Endpoint : /polls/{id}/questions/{question_id}/answer/define
     * @Method : POST
     */
    create_answer() {
        this.app.post('/polls/:id/questions/:question_id/answer/define', (req, res) => {
            try {
                const sondagesModel = new this.sondagesModel(req.body)
                const sondagesQuestionModel = new this.sondagesQuestionModel(req.body)
                const sondagesQuestionAnswerModel = new this.sondagesQuestionAnswerModel(req.body)
                const sondagesAnswerModel = new this.sondagesAnswerModel(req.body)
                
                sondagesModel.findById(req.params.id, function(err, poll) {
                    
                    if (poll) {
                        
                        sondagesQuestionModel.findById(req.params.question_id, function(err, question) {
                            if (question) {
                                
                                sondagesQuestionAnswerModel.findOne({"content" : req.body.answer, "sondage_ref": req.params.id, "question_ref": req.params.question_id}, function(err, answer) {
                                    if (answer) {
                                        
                                        sondagesAnswerModel.save().then(answers => {
                                            res.status(201).json(
                                                { 
                                                    answers: answers, 
                                                }
                                            )
                                        }).catch(err => {
                                            res.status(400).json(
                                                { 
                                                    error: {
                                                        status: 400,
                                                        message: "error",
                                                    } 
                                                }
                                            ) 
                                        })
                
                                    } else {
                                        res.status(400).json(
                                            { 
                                                error: {
                                                    status: 400,
                                                    message: "answer doesnt exist",
                                                } 
                                            }
                                        ) 
                                    }
                                }).populate('sondage_ref, question_ref');
        
                            } else {
                                res.status(400).json(
                                    { 
                                        error: {
                                            status: 400,
                                            message: "question_poll doesnt exist",
                                        } 
                                    }
                                ) 
                            }
                        }).populate('sondage_ref');

                    } else {
                        res.status(400).json(
                            { 
                                error: {
                                    status: 400,
                                    message: "poll doesnt exist",
                                } 
                            }
                        ) 
                    }
                }).populate('author_id');

            } catch (err) {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }


    /**
     * Editer un sondage
     * @Endpoint : /sondages/{id}/update
     * @Method : PUT
     */
    updateSondage() {
        this.app.put('/sondages/:id/update', (req, res) => {
            try {
                this.sondagesModel.findByIdAndUpdate(req.params.id, req.body).populate('author_id').then(poll => {
                    if(poll){
                        res.status(201).json(
                            { 
                                poll: poll, 
                            }
                        )
                    }else{
                        res.status(400).json(
                            { 
                                error: {
                                    status: 400,
                                    message: "invalid id",
                                } 
                            }
                        )  
                    }
                }).catch(err => {
                    res.status(400).json(
                        { 
                            error: {
                                status: 400,
                                message: "invalid id",
                            } 
                        }
                    ) 
                });
            } catch {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }


    /**
     * Supprimer un sondage
     * @Endpoint : /sondages/{id}/delete
     * @Method : DELETE
     */
    deleteSondage() {
        this.app.delete('/sondages/:id/delete', (req, res) => {
            try {
                this.sondagesModel.findByIdAndDelete(req.params.id).populate('author_id').then(poll => {
                    
                    if(poll){
                        res.status(200).json(
                            { 
                                success: {
                                    status: 200,
                                    message: "successfully deleted",
                                }
                            }
                        )
                    }else{
                        res.status(400).json(
                            { 
                                error: {
                                    status: 400,
                                    message: "invalid id",
                                } 
                            }
                        ) 
                    }

                }).catch(err => {
                    res.status(400).json(
                        { 
                            error: {
                                status: 400,
                                message: "invalid id",
                            } 
                        }
                    ) 
                });
            } catch {
                res.status(500).json({ error: { status: 500, message: "Internal Server Error",} })
            }
        })
    }
    
}

module.exports = Sondages