const express = require('express')
const app = express()
const apiRouter = require('./routes/api-router')

app.use(express.json())

app.use('/api', apiRouter)

app.all('/*', (req, res, next)=>{
    res.status(404).send({message: 'Path not found'})
})

app.use((err, req, res, next)=>{
    if(err.code === '22P02' || err.code === '23502' || err === 400)
        res.status(400).send({message: 'Bad request'})
    if(err === 404 || err.code === '23503')
        res.status(404).send({message: 'Not found'})

    res.status(500).send({message: 'Server error'})
})

module.exports = app
