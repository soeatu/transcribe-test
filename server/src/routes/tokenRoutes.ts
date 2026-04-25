import { Router } from "express";
import { tokenController } from "../controllers/tokenController";

const router = Router();

router.get("/speech/token", (req, res, next) =>
  tokenController.getSpeechToken(req, res, next)
);
router.post("/pubsub/negotiate", (req, res, next) =>
  tokenController.negotiatePubSub(req, res, next)
);

export { router as tokenRoutes };
