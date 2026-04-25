import { Router } from "express";
import { sessionRoutes } from "./sessionRoutes";
import { transcriptRoutes } from "./transcriptRoutes";
import { summaryRoutes } from "./summaryRoutes";
import { tokenRoutes } from "./tokenRoutes";

const router = Router();

router.use("/sessions", sessionRoutes);
router.use("/sessions/:id/transcripts", transcriptRoutes);
router.use("/sessions/:id/summary", summaryRoutes);
router.use("/", tokenRoutes);

export { router as routes };
