import { Router } from "express";
import { transcriptController } from "../controllers/transcriptController";
import { validate } from "../middlewares/validator";
import { CreateTranscriptRequestSchema } from "../models/transcript";

const router = Router({ mergeParams: true });

router.post("/", validate(CreateTranscriptRequestSchema), (req, res, next) =>
  transcriptController.create(req, res, next)
);
router.get("/", (req, res, next) =>
  transcriptController.findBySessionId(req, res, next)
);

export { router as transcriptRoutes };
