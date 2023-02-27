import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import { Socket } from "socket.io-client";

interface ISocketWithServer extends Socket {
  server: any | null;
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const socket = res.socket as unknown as ISocketWithServer;

  if (socket?.server?.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(socket?.server);

    io.on("connection", (socket) => {
      socket.on("input-change", (msg) => {
        console.log("receive input-change");
        console.log("send hello");
        socket.emit("hello", msg);
      });

      const interval = setInterval(() => {
        socket.emit("random-number", Math.floor(Math.random() * 100 + 1));
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
      }, 3000);
    });

    socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;
