const errorType = require('../constants/error-types')
const service = require('../service/user.service')

const md5password = require('../utils/password-handle')
const verifyUser = async (ctx, next) => {
    const { name, password } = ctx.request.body
    //name,password不能为空
    if (!name || !password) {
        const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
        return ctx.app.emit('error', error, ctx)
    }
    //用户已存在
    const result = await service.getUserByName(name)
    if (result.length) {
        const error = new Error(errorType.USER_ALREADY_EXISTS)
        return ctx.app.emit('error', error, ctx)
    }

    await next()
}

const handlePassword = async (ctx, next) => {
    console.log("加密")
    let { password } = ctx.request.body
    ctx.request.body.password = md5password(password)
    await next()

}
module.exports = {
    verifyUser,
    handlePassword
}