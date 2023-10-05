
const {
    getAllArticleComments, 
    getTopics, 
    getApiDescription, 
    getArticleById, 
    getAllArticles, 
    postArticleComments,
    patchArticleVotes,
    deleteCommentById,
    getAllUsers
} = require('./app.controller')

const express = require('express')
const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getApiDescription )

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getAllArticleComments)

app.post('/api/articles/:article_id/comments', postArticleComments)

app.patch('/api/articles/:article_id', patchArticleVotes)

app.delete('/api/comments/:comment_id', deleteCommentById)

app.get('/api/users', getAllUsers)

app.all('/*', (req, res, next)=>{
    res.status(404).send({message: 'Path not found'})
})

app.use((err, req, res, next)=>{
    console.log(err)
    if(err.code === '22P02' || err.code === '23502')
        res.status(400).send({message: 'Bad request'})
    if(err === 404 || err.code === '23503')
        res.status(404).send({message: 'Not found'})

    res.status(500).send({message: 'Server error'})
})

module.exports = app
