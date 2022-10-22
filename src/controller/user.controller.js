const fileService = require("../service/file.service")
const service = require("../service/user.service")
const fs = require('fs')
const { AVATAR_PATH } = require('../constants/file-path')

class UserController {
    async create(ctx, next) {
        //获取用户请求传递的参数
        const user = ctx.request.body
        const result = await service.create(user)
        //查询数据
        ctx.body = result
        //返回数据
    }
    async avatarInfo(ctx, next) {
        const { userId } = ctx.params
        const avatarInfo = await fileService.getAvatarByUserId(userId)

        ctx.response.set('content-type', avatarInfo.mimetype)
        ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`)
    }
}
module.exports = new UserController()