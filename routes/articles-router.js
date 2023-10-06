const articlesRouter = require('express').Router()
const {
    getAllArticleComments,  
    getArticleById, 
    getAllArticles, 
    postArticleComments,
    patchArticleVotes,
} = require('../app.controller')

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleVotes)

articlesRouter
    .get('/', getAllArticles)

articlesRouter
    .route('/:article_id/comments')    
    .get(getAllArticleComments)
    .post(postArticleComments)

module.exports = articlesRouter
