const {
    fetchAllArticleComments, 
    fetchTopics, 
    fetchArticleById,
    fetchAllArticles, 
    insertComments,
    updateArticleVotes,
    removeCommentById
 } = require('./app.model')

const endpoints = require('./endpoints.json')

exports.getTopics = (req, res, next)=>{
    fetchTopics().then((topics)=>{
        if (!topics[0]) {
            res.status(200).send({message: 'The topics table is empty', data: topics})
        }
        res.status(200).send({topics})
    })
}

exports.getApiDescription = (req, res, next)=>{
    res.status(200).send(endpoints)
}

exports.getArticleById = (req, res, next)=>{
    fetchArticleById(req.params.article_id).then((article)=>{
        res.status(200).send(article)
    }).catch( err => next(err))
}

exports.getAllArticles = (req, res, next)=>{
    fetchAllArticles().then((articles)=>{
        res.status(200).send(articles)
    })
}

exports.getAllArticleComments = (req, res, next)=>{
    fetchAllArticleComments(req.params.article_id).then((comments)=>{
        res.status(200).send({comments})
    }).catch( err => next(err))
}

exports.postArticleComments = (req, res, next)=>{
    insertComments(req.body,req.params.article_id).then((comment)=>{
        res.status(200).send(comment)
    }).catch( err => next(err))
}

exports.patchArticleVotes = (req, res, next)=>{
    updateArticleVotes(req.body.inc_votes, req.params.article_id).then((article)=>{
        res.status(200).send(article)
    }).catch( err => next(err))
}

exports.deleteCommentById = (req,res, next)=>{
    removeCommentById(req.params.comment_id).then(()=>{
        res.status(204).send()
    }).catch( err=> next(err))
}
