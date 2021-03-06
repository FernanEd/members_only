import { Handler } from "express";
import Message from "../models/message";

export const getAddMessage: Handler = async (req, res, next) => {
  res.render("message_form");
};

export const postAddMessage: Handler = async (req, res, next) => {
  const { title, content } = req.body;
  try {
    const created = await Message.create({
      title,
      content,
      author: req.user?.id,
    });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getDeleteMessage: Handler = async (req, res, next) => {
  res.render("message_delete");
};

export const postDeleteMessage: Handler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleted = await Message.findByIdAndDelete(id);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    next(err);
  }
};
