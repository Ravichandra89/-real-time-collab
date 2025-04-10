import { redisClient, RedisClientType } from "../config/redis";

// Add user's to room
export const addUserToRoom = async (
  redis: RedisClientType,
  roomId: string,
  socketId: string
): Promise<void> => {
  try {
    await redisClient.hSet(`room:${roomId}`, socketId, Date.now().toString());
    console.log(`Added socket ${socketId} to room ${roomId}`);
  } catch (error) {
    console.error(`Error adding user to room ${roomId} : `, error);
    throw error;
  }
};

// Remove user from the room
export const removeUserFromRoom = async (redis: RedisClientType, roomId: string, socketId: string) : Promise<void> => {
    try {
        await redisClient.hDel(`room:${roomId}`, socketId);
        console.log(`Removed socket ${socketId} from room ${roomId}`);
    } catch (error) {
        console.error(`Error removing user from room ${roomId}: `, error);
        throw error;
    }
}

// Get all users in room
export const getUsersInRoom = async (roomId: string, redis: RedisClientType) => {
    try {
        const users = await redisClient.hKeys(`room:${roomId}`);
        return users;
    } catch (error) {
        console.error(`Error fetching users in room ${roomId}:`, error);
        throw error;
    }
};

// Check room existance and has Users
export const roomExists = async (redis: RedisClientType, roomId: string): Promise<boolean> => {
    try {
        const count = await redisClient.hLen(`room:${roomId}`);
        return count > 0;
    } catch (error) {
        console.error(`Error checking room ${roomId} existance: `, error);
        return false;
    }
};

// clean the room
export const cleanupRoom = async (redis: RedisClientType, roomId: string) : Promise<void> => {
    try {
        const userCounts = await redis.hLen(`room:${roomId}`);
        if (userCounts === 0) {
            await redis.del(`room${roomId}`);
            console.log(`Cleaned up empty room ${roomId}`);
        }
    } catch (error) {
        console.error(`Error cleaning up room ${roomId}:`, error);
        throw error;
    }
};

