import Redis from "ioredis";
import { upstashRedisRestUrl } from "../env/envoriment.js";

const redisClient = new Redis(upstashRedisRestUrl);

export default redisClient;
