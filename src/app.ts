import express from "express";
import mongoose from "mongoose";
import path from "path";
import config from "./utils/config";

const app = express();

//TEMPLATE ENGINE

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

//MIDDLEWARE

import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import User, { IUser } from "./models/user";

app.use(cors());
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser<any, any>((req, user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err: Error, user: Express.User) => {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../public")));

//ROUTERS

// DEFAULT ROUTES

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res, next) => {
  const { first, last, username, password, confirm } = req.body;

  if (password !== confirm) {
    res.render("signup", { error: "Password confirmation does not match." });
  }

  try {
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
