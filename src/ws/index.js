import { WebSocketServer } from "ws";
import http from "http";

const server = http.createServer();
const wss = new WebSocketServer({ server });  // Pass { server } instead of a URL

wss.on("connection", (ws) => {
  console.log("WebSocket connected:", ws._socket.remoteAddress);
  console.log("WebSocket Parameters:", {
    protocol: ws.protocol,
    readyState: ws.readyState,
    binaryType: ws.binaryType,
  });

  ws.on("message", (message) => {
    console.log("Received command:", message.toString());
    const result = `Command received: ${message}`;
    ws.send(result);
  });

  ws.on("close", () => {
    console.log("WebSocket closed");
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

process.on("SIGINT", () => {
  wss.clients.forEach((client) => client.close());
  wss.close(() => {
    console.log("WebSocket server closed");
    process.exit();
  });
});
