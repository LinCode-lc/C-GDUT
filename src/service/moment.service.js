const connection = require('../app/database')

class MomentService {
    async create(userId, content) {
        const statement = `INSERT INTO moment (content,user_id) VALUES (?,?);`
        const [result] = await connection.execute(statement, [content, userId])
        return result
    }
    async getMomentById(id) {
        const statement = `SELECT
         m.id id,m.content content,m.createAt createTime,m.updateAt updateTime,
         JSON_OBJECT('id',u.id,'name',u.name) user
         FROM moment m
         LEFT JOIN users u ON m.user_id = u.id
         WHERE m.id = ?;
        `
        const [result] = await connection.execute(statement, [id])
        return result[0]
    }

    async getMomentList(offset, size) {

        const statement = `	SELECT m.id id,m.content content,m.createAt createTime,m.updateAt updateTime,
				JSON_OBJECT('id',u.id,'name',u.name,'avatar',u.avatar_url) author,
				IF(COUNT(l.id),JSON_ARRAYAGG(JSON_OBJECT('id',l.id,'name',l.name)) ,NULL)labels,
				(SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount
				FROM moment m

				LEFT JOIN users u ON m.user_id = u.id
				LEFT JOIN moment_label ml ON m.id = ml.moment_id
                LEFT JOIN label l ON ml.label_id = l.id
				GROUP BY m.id
				LIMIT ?,?;
        `
        const [result] = await connection.execute(statement, [offset, size])
        return result
    }

    async updateMomentById(id, content) {
        const statement = `
            UPDATE moment SET content = ? WHERE id = ?;
        `
        const [result] = await connection.execute(statement, [content, id])
        return result
    }

    async removeMomentById(id) {
        const statement = `
            DELETE FROM moment WHERE id = ?;
        `
        const [result] = await connection.execute(statement, [id])
        return result
    }
    async hasLabel(momentId, labelId) {
        const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?`
        const [result] = await connection.execute(statement, [momentId, labelId])
        return result[0] ? true : false
    }
    async addLabel(momentId, labelId) {
        const statement = `INSERT INTO moment_label (moment_id,label_id) VALUE (?,?)`
        const [result] = await connection.execute(statement, [momentId, labelId])
        return result
    }
}

module.exports = new MomentService()