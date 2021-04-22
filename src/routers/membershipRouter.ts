import { Router } from "express";
import * as controller from "../controllers/membershipControllers";

const router = Router();

router
  .route("/membership")
  .get(controller.getMembershipForm)
  .post(controller.postMembershipForm);

export default router;
