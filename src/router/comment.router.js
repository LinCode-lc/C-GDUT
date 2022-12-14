const Router = require('koa-router')
const { verifyPermission, verifyAuth } = require('../middleware/auth.middleware')
const { create, reply, update } = require('../controller/comment.controller')
const commentRouter = new Router({ prefix: '/comment' })

commentRouter.post('/', verifyAuth, create)
commentRouter.post('/reply', verifyAuth, reply)
commentRouter.patch('/:commentId', verifyAuth, verifyPermission, update)
module.exports = commentRouter