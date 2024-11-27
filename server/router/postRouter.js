import express from "express";
import * as postController from "../controllers/postController.js";

const postRouter = express.Router();

export const initPostRouter = (app) => {

    postRouter.post("/api/create/room", postController.test);

    return app.use('/', postRouter);
};