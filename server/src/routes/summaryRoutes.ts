import { Router } from "express";
import { summaryController } from "../controllers/summaryController";

const router = Router({ mergeParams: true });

router.post("/", (req, res, next) => summaryController.generate(req, res, next));
router.get("/", (req, res, next) => summaryController.findBySessionId(req, res, next));
router.put("/", (req, res, next) => summaryController.update(req, res, next));

export { router as summaryRoutes };
