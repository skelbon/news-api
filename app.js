
const {getAllArticleComments, getTopics, getApiDescription, getArticleById, getAllArticles} = require('./app.controller')

const express = require('express')
const app = express()

app.get('/api/topics', getTopics)

app.get('/api', getApiDescription )

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getAllArticleComments)

app.all('/*', (req, res, next)=>{
    res.status(404).send({message: 'Path not found'})
})

app.use((err, req, res, next)=>{
    if(err.code === '22P02')
        res.status(400).send({message: 'Bad request - invalid input syntax - integer expected'})
    if(err = 404)
        res.status(404).send({message: 'Not found'})
    res.status(500).send({message: 'Server error'})
})

module.exports = app
