import { Router } from "express";
import * as controller from "../controllers/membershipControllers";

const router = Router();

router
  .route("/")
  .get(controller.getMembershipForm)
  .post(controller.postMembershipForm);

export default router;
