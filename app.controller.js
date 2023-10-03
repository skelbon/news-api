const {fetchTopics, fetchArticleById,fetchAllArticles} = require('./app.model')
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
    }).catch( err => res.status(400).send(err))
}

exports.getAllArticles = (req, res, next)=>{
    fetchAllArticles().then((articles)=>{
        res.status(200).send(articles)
    })
}