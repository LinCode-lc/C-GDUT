const fileService = require('../service/file.service')
const { AVATAR_PATH } = require('../constants/file-path')
const { APP_HOST, APP_PORT } = require('../app/config')
const userService = require('../service/user.service')
class FileController {
    async saveAvatarInfo(ctx, next) {
        // console.log("保存头像信息")   
        const { filename, mimetype, size } = ctx.req.file
        const { id } = ctx.user
        const result = await fileService.createAvatar(filename, mimetype, size, id)
        //将头像id保存在user表中
        const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`
        await userService.updateAvatarUrlById(avatarUrl, id)
        ctx.body = result
    }
    async savePictureInfo(ctx, next) {
        const files = ctx.req.files
        const { id } = ctx.user
        const { momentId } = ctx.query
        //将多个文件信息存放到数据库中
        for (let file of files) {
            const { filename, mimetype, size } = file
            await fileService.createFile(filename, mimetype, size, id, momentId)
        }
        ctx.body = '动态图片上传成功'
    }
}
module.exports = new FileController()