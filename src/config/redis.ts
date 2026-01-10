import Redis from "ioredis";
import { config } from "./index";
import { logger } from "./logger";

export const redis = new Redis(config.redis.url, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
        if (times > 3) {
            logger.error("Redis connection failed after 3 retries");
            return null;
        }
        return Math.min(times * 100, 3000);
    },
});

redis.on("connect", () => {
    logger.info("Redis connected");
});

redis.on("error", (err) => {
    logger.error("Redis error", { error: err.message });
});
