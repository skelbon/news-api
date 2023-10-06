const usersRouter = require('express').Router()
const { getAllUsers } = require('../app.controller')


usersRouter
    .route('/')
    .get(getAllUsers)

module.exports = usersRouter