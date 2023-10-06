const commentsRouter = require('express').Router()
const { deleteCommentById } = require('../app.controller')


commentsRouter
    .route('/:comment_id')
    .delete(deleteCommentById)

module.exports = commentsRouter