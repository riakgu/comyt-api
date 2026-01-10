import { Response, Request, NextFunction } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../errors/response.error";
import { config } from "../config";

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ZodError) {
        res.status(400).json({
            error: "Validation Error",
            details: error.issues.map(issue => ({
                path: issue.path.join('.'),
                message: issue.message
            }))
        });
    } else if (error instanceof ResponseError) {
        res.status(error.status).json({
            errors: error.message
        });
    } else {
        res.status(500).json({
            errors: config.app.env === "development" ? error.message : "Internal server error"
        });
    }
}