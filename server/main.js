console.info(`ENV: ${process.env.NODE_ENV}`)

import express from "express"
import { initGetRouter } from "./router/getRouter.js"
import { initPostRouter } from "./router/postRouter.js"

const app = express()

initGetRouter(app)
initPostRouter(app)

// TODO: Find out why it's like this
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development") {
  (async () => {
    const test = await import("./socketServer/socket.js")
    app.listen(8080, () => console.log("API: http://localhost:8080"));
  })();
}
