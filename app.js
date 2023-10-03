const {getTopics, getApiDescription, getArticleById, getAllArticles} = require('./app.controller')
const express = require('express')
const app = express()

app.get('/api/topics', getTopics)

app.get('/api', getApiDescription )

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.all('/*', (req, res, next)=>{
    res.status(404).send({message: 'Path not found'})
})

app.use((err, req, res, next)=>{
    res.status(500).send({message: 'Server error'})
})

module.exports = app