import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

export function attachRealtime(server: HttpServer) {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000" },
  });

  const broadcastCount = () => {
    io.emit("sessions:count", io.of("/").sockets.size);
  };

  io.on("connection", (socket) => {
    broadcastCount();
    // На этапе disconnect сокет уже исключён из списка подключений.
    socket.on("disconnect", broadcastCount);
  });

  return io;
}
