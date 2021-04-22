import { Handler } from "express";
import Message from "../models/message";

export const getAddMessage: Handler = async (req, res, next) => {
  res.render("message_form");
};

export const postAddMessage: Handler = async (req, res, next) => {
  const { title, message } = req.body;
  try {
    const created = await Message.create({
      title,
      message,
      author: req.user?.id,
    });
    res.redirect("index");
  } catch (err) {
    console.log(err);
    next(err);
  }
};
