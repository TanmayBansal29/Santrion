// Importing createClient module from redis
const {createClient} = require("redis")
require("dotenv").config()

// Creating a redis client
const redisClient = createClient({
    username: REDIS_USER,
    password: REDIS_PASS,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    }
})

// Error Handler
redisClient.on("error", (err) => console.log("Redis Client Error: ", err))

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

export default redisClient