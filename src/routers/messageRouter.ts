import { Router } from "express";
import * as controller from "../controllers/messageControllers";

const router = Router();

router
  .route("/add")
  .get(controller.getAddMessage)
  .post(controller.postAddMessage);

router
  .route("/delete/:id")
  .get(controller.getDeleteMessage)
  .post(controller.postDeleteMessage);

export default router;
