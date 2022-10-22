const Multer = require('koa-multer')
const { AVATAR_PATH, PICTURE_PATH } = require('../constants/file-path')
// console.log(0)
const avatarUpload = Multer({
    dest: AVATAR_PATH
})
const pictureUpload = Multer({
    dest: PICTURE_PATH
})
const pictureHandler = pictureUpload.array('picture', 9)
const avatarHandler = avatarUpload.single('avatar')

module.exports = {
    avatarHandler,
    pictureHandler
}