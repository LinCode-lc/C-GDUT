const jwt = require('jsonwebtoken')

const errorType = require('../constants/error-types')
const userService = require('../service/user.service')
const authService = require('../service/auth.service')
const md5password = require('../utils/password-handle')
const { PUBLIC_KEY, PRIVATE_KEY } = require('../app/config')
//判断数据库是否有该用户，且密码正确
const verifyLogin = async (ctx, next) => {
    const { name, password } = ctx.request.body
    //判断name,password是否为空
    //name,password不能为空
    if (!name || !password) {

        const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
        return ctx.app.emit('error', error, ctx)
    }

    //判断用户是否存在

    const result = await userService.getUserByName(name)
    const user = result[0]
    if (!user) {
        const error = new Error(errorType.USER_DOES_NOT_EXISTS)
        return ctx.app.emit('error', error, ctx)
    }
    //判断密码正不正确
    if (md5password(password) !== user.password) {
        const error = new Error(errorType.PASSWORD_IS_INCORRENT)
        return ctx.app.emit('error', error, ctx)
    }

    ctx.user = user
    await next()

}
//验证token
const verifyAuth = async (ctx, next) => {
    // console.log("验证授权的middleware")
    //获取token
    const authorization = ctx.headers.authorization

    if (!authorization) {

        const error = new Error(errorType.UNAUTHORIZATION)
        return ctx.app.emit('error', error, ctx)
    }

    const token = authorization.replace('Bearer ', '')

    //验证token(id/name/exp)
    try {
        const result = jwt.verify(token, PUBLIC_KEY, {
            algorithms: ["RS256"]
        })

        ctx.user = result


    } catch (err) {

        const error = new Error(errorType.UNAUTHORIZATION)
        ctx.app.emit('error', error, ctx)
    }
    await next()
}
//验证用户是否有权限
const verifyPermission = async (ctx, next) => {
    const [resourceKey] = Object.keys(ctx.params)

    const tableName = resourceKey.replace('Id', '')

    const resourceId = ctx.params[resourceKey]

    const { id } = ctx.user
    try {
        const isPermission = await authService.checkResource(tableName, resourceId, id)
        // console.log(isPermission)
        if (!isPermission) throw new Error()
        await next()
    } catch (err) {
        const error = new Error(errorType.UNPERMISSION)
        return ctx.app.emit('error', error, ctx)
    }

}


module.exports = {
    verifyLogin,
    verifyAuth,
    verifyPermission
}