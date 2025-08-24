// Importing createClient module from redis
const {createClient} = require("redis")
require("dotenv").config()

// Creating a redis client
const redisClient = createClient({
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
})

// Event Handler
redisClient.on("error", (err) => console.log("Redis Client Error: ", err))
redisClient.on("connect", () => console.log("Redis Client connecting..."));
redisClient.on("ready", () => console.log("Redis Client ready ✅"));

// Connect once server starts
(
    async () => {
        try {
            await redisClient.connect()
            console.log("Connected to Redis Cloud")
        } catch (err) {
            console.error("Redis Connection Failed: ", err)
        }
    }
)();

module.exports = redisClient