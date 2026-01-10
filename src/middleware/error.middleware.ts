import { Response, Request, NextFunction } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../errors/response.error";
import { config } from "../config";

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};
        error.issues.forEach(issue => {
            const field = issue.path.join('.') || '_root';
            if (!fieldErrors[field]) {
                fieldErrors[field] = [];
            }
            fieldErrors[field].push(issue.message);
        });
        res.status(400).json({
            errors: fieldErrors
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