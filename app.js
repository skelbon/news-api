const {getTopics, getApiDescription} = require('./app.controller')
const express = require('express')
const app = express()

app.get('/api/topics', getTopics)

app.get('/api', getApiDescription )

app.all('/*', (req, res, next)=>{
    res.status(404).send({message: 'Path not found'})
})

app.use((err, req, res, next)=>{
    res.status(500).send({message: 'Server error'})
})

module.exports = app