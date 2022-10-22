const Router = require('koa-router')

const momentRouter = new Router({ prefix: '/moment' })

const { create, detail, update, remove, list, addLabels, fileInfo } = require('../controller/moment.controller.js')
const { verifyAuth, verifyPermission, } = require('../middleware/auth.middleware.js')
const { verifyLabelExists } = require('../middleware/label.middleware')
momentRouter.post('/', verifyAuth, create)
momentRouter.post('/:momentId/labels', verifyAuth, verifyPermission, verifyLabelExists, addLabels)
momentRouter.get('/:momentId', detail)
momentRouter.get('/', list)

momentRouter.patch('/:momentId', verifyAuth, verifyPermission, update)
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove)
momentRouter.get('/image/:filename', fileInfo)
module.exports = momentRouter