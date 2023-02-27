import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
let socket: Socket;

const SocketTest = () => {
  const [input, setInput] = useState("");
  const [numbers, setNumbers] = useState("");

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("hello", (msg: string) => {
      console.log("receive hello");
      setInput(msg);
    });

    socket.on("random-number", (number) => {
      setNumbers((prev) => {
        if (!prev.length) {
          return (prev += number);
        }
        return (prev += `, ${number}`);
      });
    });
  };

  useEffect(() => {
    socketInitializer();
  }, []);

  const onChangeHandler = (e: any) => {
    setInput(e.target.value);
    console.log("send input-change");
    socket.emit("input-change", e.target.value);
  };

  return (
    <div style={{ width: "100%" }}>
      <input
        placeholder="Type something"
        value={input}
        onChange={onChangeHandler}
      />
      <p style={{ minHeight: "70px" }}>Random numbers: {numbers}</p>
    </div>
  );
};

export default SocketTest;
