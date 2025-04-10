import { Socket, Server } from "socket.io";
import { RedisClientType } from "redis";
import {
  addUserToRoom,
  removeUserFromRoom,
  getUsersInRoom,
  roomExists,
  cleanupRoom,
} from "../models/room.model";

interface UpdatePayload {
  roomId: string;
  data: string;
}

export default (io: Server, redis: RedisClientType) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected: ", socket.id);

    // Joining room logic
    socket.on("join", async (roomId: string) => {
      try {
        socket.join(roomId);
        await addUserToRoom(redis, roomId, socket.id);

        console.log(`Socket ${socket.id} joined room ${roomId}`);
      } catch (error) {
        console.error(`Error joining room ${roomId}`, error);
        socket.emit("error", `Failed to join room ${roomId}`);
      }
    });

    // Handle Real time Update events
    socket.on("update", async (payload: UpdatePayload) => {
      try {
        if (!payload.roomId || !payload.data) {
          throw new Error("Invalid payload");
        }

        io.to(payload.roomId).emit("update", payload.data);
        console.log(
          `Broadcasting updated to room ${payload.roomId}: ${payload.data}`
        );
      } catch (error) {
        console.error(
          `Error broadcasting update to room ${payload.roomId}`,
          error
        );
        socket.emit("error", `Failed to sent update`);
      }
    });

    // Handle disconnection feature
    socket.on("disconnect", async () => {
      try {
        const rooms = Array.from(socket.rooms).filter(
          (room) => room !== socket.id
        );

        // Remove sockets from each rooms
        for (const roomId of rooms) {
          await removeUserFromRoom(redis, roomId, socket.id);
          await cleanupRoom(redis, roomId);

          console.log(`Socket ${socket.id} removed from room ${roomId}`);
        }

        console.log("User disconnected:", socket.id);
      } catch (error) {
        console.error(`Error Handling disconnect: `, error);
      }
    });
  });
};
