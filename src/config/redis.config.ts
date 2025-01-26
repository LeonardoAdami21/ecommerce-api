import Redis from "ioredis";
import { upstashRedisRestUrl } from "../env/envoriment";

const redisClient = new Redis(upstashRedisRestUrl);

export default redisClient;
