const servcie = require('../service/laber.service')
//验证标签是否已经存在
const verifyLabelExists = async (ctx, next) => {
    //取出要添加的所有标签
    const { labels } = ctx.request.body
    //判断每个标签在label表中是否存在
    const newLabels = []
    for (let name of labels) {
        const labelResult = await servcie.getLabelByName(name)

        const label = { name }

        if (!labelResult) {
            const result = await servcie.create(name)
            console.log(result)
            label.id = result.insertId
        } else {
            label.id = labelResult.id
        }
        newLabels.push(label)
    }
    ctx.labels = newLabels
    await next()
}
module.exports = {
    verifyLabelExists
}