import type { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";
import { config } from "../config";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (config.app.env === 'test') {
        return next();
    }

    try {
        const ip = req.ip || req.socket.remoteAddress || "unknown";
        const key = `rate_limit:${ip}`;

        const current = await redis.incr(key);

        if (current === 1) {
            await redis.pexpire(key, config.rateLimit.windowMs);
        }

        const ttl = await redis.pttl(key);

        res.setHeader("X-RateLimit-Limit", config.rateLimit.max);
        res.setHeader("X-RateLimit-Remaining", Math.max(0, config.rateLimit.max - current));
        res.setHeader("X-RateLimit-Reset", Math.ceil(Date.now() / 1000) + Math.ceil(ttl / 1000));

        if (current > config.rateLimit.max) {
            res.status(429).json({
                errors: "Too many requests, please try again later"
            });
            return;
        }

        next();
    } catch (error) {
        next();
    }
};
