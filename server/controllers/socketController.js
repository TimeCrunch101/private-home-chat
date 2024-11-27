import { spawn } from "child_process";
import { logSocketEvent } from "./dbController.js";



const wsServer = spawn("node",["./server/socketServer/socket.js"], {
    stdio: ["inherit", "inherit", "inherit", "ipc"]
  })

const logIt = (data) => {
  if (process.env.NODE_ENV === "development") {
    console.log(data)
  }
}

wsServer.on("message", (data) => {
  switch (data.event) {
    case "log message":
      logIt(data)
      logSocketEvent(data)
      break;
  
    default:
      logIt(data)
      break;
  }
})