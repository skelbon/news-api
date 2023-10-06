const apiRouter = require('express').Router();
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router')
const {getApiDescription} = require('../app.controller');
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');

apiRouter
    .route('/')
    .get(getApiDescription)
    
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter)
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/users', usersRouter)

module.exports = apiRouter;