import { io } from "socket.io-client";

const socket = io("https://webspeakers-backend.onrender.com"); // Reemplaza con tu URL real

socket.on("connect", () => {
  console.log("Conectado al servidor con ID:", socket.id);
});

export default socket;
