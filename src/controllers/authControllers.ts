import { Handler } from "express";
import User from "../models/user";
import passport from "passport";
import bcrypt from "bcryptjs";

export const getLoginForm: Handler = (req, res) => {
  res.render("login");
};

export const postLoginForm: Handler = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
});

export const makeLogout: Handler = (req, res) => {
  req.logout();
  res.redirect("/");
};

export const getSignUpForm: Handler = (req, res) => {
  res.render("signup");
};

export const postSignUpForm: Handler = async (req, res, next) => {
  const { first, last, username, password, confirm } = req.body;

  if (password !== confirm) {
    res.render("signup", { error: "Password confirmation does not match." });
  }

  try {
    const userExists = await User.findOne({ username: username });

    if (userExists) {
      res.render("signup", { error: "Username already taken." });
    }

    const hash = await bcrypt.hash(password, 10);
    const created = await User.create({
      name: { first, last },
      username,
      password: hash,
    });
    console.log(created);
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    next(err);
  }
};
