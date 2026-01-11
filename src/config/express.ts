import express from 'express';
import type { Request, Response, NextFunction } from "express";
import commitRoutes from "../routes/commit.route";
import { errorMiddleware } from "../middleware/error.middleware";
import { rateLimitMiddleware } from "../middleware/rate-limit.middleware";
import { config } from "../config";
import helmet from 'helmet';
import cors from 'cors';

export const app = express();

app.use(helmet());

app.use(cors({
    origin: config.app.env === 'production'
        ? config.app.corsOrigin
        : '*',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/commits', rateLimitMiddleware, commitRoutes);

app.use(errorMiddleware);