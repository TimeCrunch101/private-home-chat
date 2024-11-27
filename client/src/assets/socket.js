import { io } from "socket.io-client";

let server = null

if (process.env.NODE_ENV === "development") {
    server = "http://localhost:3000"
} else {
    server = "https://ws.cincitechlabs.com"
}

const socket = io(server, {autoConnect: false});

// if (process.env.NODE_ENV === "development") {
//     socket.onAny((event, ...args) => {
//         console.info("DEV: Event: ", event, args);
//       });
// }

export default socket;