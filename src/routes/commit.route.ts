import { Router } from "express";
import { CommitController } from "../controllers/commit.controller";

const router = Router();

router.post("/generate", CommitController.generate);

export default router;