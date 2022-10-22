const fileService = require('../service/file.service')
const momentService = require('../service/moment.service')
const { PICTURE_PATH } = require('../constants/file-path')
const fs = require('fs')
class MomentController {
    async create(ctx, next) {
        const userId = ctx.user.id
        const content = ctx.request.body.content
        const result = await momentService.create(userId, content)
        ctx.body = result
    }

    async detail(ctx, next) {
        const momentId = ctx.params.momentId;

        const result = await momentService.getMomentById(momentId)

        ctx.body = result

    }
    async list(ctx, next) {
        const { offset, size } = ctx.query
        console.log(offset)
        console.log(size)
        const result = await momentService.getMomentList(offset, size)
        ctx.body = result
    }
    async update(ctx, next) {
        // console.log("moment updata controller")
        const momentId = ctx.params.momentId;
        const content = ctx.request.body.content
        const result = await momentService.updateMomentById(momentId, content)

        ctx.body = result
    }
    async remove(ctx, next) {
        // console.log("moment remove controller")
        const momentId = ctx.params.momentId;
        const result = await momentService.removeMomentById(momentId)

        ctx.body = result
    }
    async addLabels(ctx, next) {
        const { labels } = ctx
        const { momentId } = ctx.params

        for (let label of labels) {
            const isExist = await momentService.hasLabel(momentId, label.id)
            if (!isExist) {
                await momentService.addLabel(momentId, label.id)
            }
        }

        ctx.body = "给动态添加标签"
    }
    async fileInfo(ctx, next) {
        const { filename } = ctx.params
        const fileInfo = await fileService.getFileByFilename(filename)

        ctx.response.set('content-type', fileInfo.mimetype)
        ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`)
    }

}
module.exports = new MomentController()