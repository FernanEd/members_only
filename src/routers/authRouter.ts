import { Router } from "express";
import * as controller from "../controllers/authControllers";

const router = Router();

router
  .route("/login")
  .get(controller.getLoginForm)
  .post(controller.postLoginForm);

router
  .route("/signup")
  .get(controller.getSignUpForm)
  .post(controller.postSignUpForm);

router.get("/logout", controller.makeLogout);

export default router;
