const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const userRouter = require("../router/user.router")
const authRouter = require("../router/auth.router")
const errorHandler = require("./error-handler")
const useRouters = require("../router/index")
const app = new Koa()

app.use(bodyParser())
app.on('error', errorHandler)
useRouters(app)


module.exports = app