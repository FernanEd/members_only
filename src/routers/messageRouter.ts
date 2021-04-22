import { Router } from "express";
import * as controller from "../controllers/messageControllers";

const router = Router();

router
  .route("/add")
  .get(controller.getAddMessage)
  .post(controller.postAddMessage);

export default router;
