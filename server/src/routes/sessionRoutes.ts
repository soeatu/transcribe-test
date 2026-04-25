import { Router } from "express";
import { sessionController } from "../controllers/sessionController";
import { validate } from "../middlewares/validator";
import {
  CreateSessionRequestSchema,
  UpdateSessionRequestSchema,
} from "../models/session";

const router = Router();

router.post("/", validate(CreateSessionRequestSchema), (req, res, next) =>
  sessionController.create(req, res, next)
);
router.get("/", (req, res, next) => sessionController.findAll(req, res, next));
router.get("/:id", (req, res, next) => sessionController.findById(req, res, next));
router.patch("/:id", validate(UpdateSessionRequestSchema), (req, res, next) =>
  sessionController.update(req, res, next)
);
router.delete("/:id", (req, res, next) => sessionController.delete(req, res, next));

export { router as sessionRoutes };
