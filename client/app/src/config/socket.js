import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling", "flashsocket"],
  path: "/socket.io",
  secure: true,
  rejectUnauthorized: false,
  cors: { origin: "http://localhost:3000" },
  origins: "http://localhost:3000",
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});
socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO server");
});
socket.on("connect_error", (error) => {
  console.error("Socket.IO connection error:", error);
});

export default socket;
 