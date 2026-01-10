import express from 'express';
import type { Request, Response, NextFunction } from "express";
import commitRoutes from "../routes/commit.route";
import { errorMiddleware } from "../middleware/error.middleware";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/commits', commitRoutes);

app.use(errorMiddleware);