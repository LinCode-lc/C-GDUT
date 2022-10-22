const errorType = require('../constants/error-types')
const errorHandler = (error, ctx) => {
    let status, message
    switch (error.message) {
        case errorType.NAME_OR_PASSWORD_IS_REQUIRED:
            status = 400 //BAD request
            message = "用户名或密码不能为空"
            break
        case errorType.USER_ALREADY_EXISTS:
            status = 409 //conflict 冲突
            message = "用户已存在"
            break
        case errorType.USER_DOES_NOT_EXISTS:
            status = 400//参数错误
            message = "用户未注册"
            break
        case errorType.PASSWORD_IS_INCORRENT:
            status = 400//参数错误
            message = "密码错误"
            break
        case errorType.UNAUTHORIZATION:
            status = 401//无权限
            message = "token过期"
            break
        case errorType.UNPERMISSION:
            status = 401//无权限
            message = "无操作权限"
            break
        default:
            status = 404
            message = "NOT FOUND"

    }
    console.log(message)
    ctx.status = status
    ctx.body = message

}
module.exports = errorHandler