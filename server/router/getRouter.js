import express from "express"
import * as getController from "../controllers/getController.js"
const getRouter = express.Router()


export const initGetRouter = (app) => {

    getRouter.get("/test", getController.test)

    return app.use('/', getRouter)
}