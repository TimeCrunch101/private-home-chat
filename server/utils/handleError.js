const { DB } = require("../config/db/db_connect")

exports.logError = (errMsg) => {
    return new Promise((resolve, reject) => {
        DB.query("INSERT INTO error_logs SET message = ?, time = ?", [errMsg, Date.now()], (err, res) => {
            try {
                if (err) throw err;
                resolve(res)
                console.log(res)
            } catch (error) {
                reject(error)
            }
        })
    })
}