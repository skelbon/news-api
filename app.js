const {getTopics} = require('./app.controller')
const express = require('express')
const app = express()

app.get('/api/topics', getTopics)

app.use((err, req, res, next)=>{
    res.status(500).send({message: 'Server error'})
})

module.exports = app