import express from "express";
import mongoose from "mongoose";
import path from "path";

const app = express();

//TEMPLATE ENGINE

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

//MIDDLEWARE

import cors from "cors";
import morgan from "morgan";
import config from "./utils/config";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../public")));

//ROUTERS

// DEFAULT ROUTES

app.get("/", (req, res) => {
  res.render("index");
});

//START

export default () => {
  mongoose.connect(
    config.MONGODB_URI,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
      app.listen(config.PORT, () => {
        console.log(`Server started on port ${config.PORT}`);
      });
    }
  );
};
