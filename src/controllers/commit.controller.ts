import type { Request, Response, NextFunction } from "express";
import { CommitService } from "../services/commit.service";
import type { GenerateCommitRequest } from "../models/commit.model";

export class CommitController {

    static async generate(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await CommitService.generate(req.body as GenerateCommitRequest);
            res.status(200).json({ data: response });
        } catch (error) {
            next(error);
        }
    }

}