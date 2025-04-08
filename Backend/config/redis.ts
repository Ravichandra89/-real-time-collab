import {createClient} from "redis";

const redisClient = createClient({
    socket: {
        host: 'localhost',
        port: 6379,
    }
});

redisClient.on("error", (error) => {
    console.error("Redis Client Error", error);
});

redisClient.on("connect", () => {
    console.log("Redis Client Connected");
});

redisClient.on("ready", () => {
    console.log("Redis Client Ready");
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error("Redis Connection Error", error);
    }
};

export {redisClient, connectRedis};