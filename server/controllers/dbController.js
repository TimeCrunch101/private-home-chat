import { DB } from "../config/db/db_connect.js"

export const logSocketEvent = (data) => {
    return new Promise((resolve, reject) => {
        DB.query("INSERT INTO logs SET ?", {
            message: data.message,
            time: Date.now(),
            log_level: data.log_level
        }, (err, res) => {
            try {
                if (err) throw new Error("Could not store log in DB", {cause: err.message})
                resolve(res)                
            } catch (error) {
                reject(error)
            }
        })
    })
}