import { Handler } from "express";
import User from "../models/user";
import config from "../utils/config";

export const getMembershipForm: Handler = (req, res) => {
  res.render("membership");
};

export const postMembershipForm: Handler = async (req, res, next) => {
  const { code } = req.body;
  if (code !== config.MEMBER_CODE) {
    res.render("membership", { error: "The code entered is not valid" });
  } else {
    try {
      const updated = await User.findByIdAndUpdate(req.user?.id, {
        membershipStatus: "member",
      });
      res.redirect("/");
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
};
