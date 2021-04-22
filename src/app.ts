import express, { Handler } from "express";
import mongoose from "mongoose";
import path from "path";
import config from "./utils/config";
import bcrypt from "bcryptjs";

const app = express();

//TEMPLATE ENGINE

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

//MIDDLEWARE

import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MongoStore from "connect-mongo";

import User, { IUser } from "./models/user";

app.use(cors());

const DBconnection = mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((m) => m.connection.getClient());
// PASSPORT AUTH & SESSIONS

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      clientPromise: DBconnection,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 7000 * 60 * 60 * 24, // 7 days
    },
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

import messageRouter from "./routers/messageRouter";
import membershipRouter from "./routers/membershipRouter";
import authRouter from "./routers/authRouter";

const protectRoute: Handler = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.use("/", authRouter);
app.use("/message", protectRoute, messageRouter);
app.use("/membership", protectRoute, membershipRouter);

// DEFAULT ROUTES

import Message from "./models/message";

app.get("/", async (req, res, next) => {
  try {
    const docs = await Message.find()
      .sort({ timestamp: "desc" })
      .lean()
      .populate("author")
      .exec();
    res.render("index", { messages: docs });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

//START

export default () => {
  app.listen(config.PORT, () => {
    console.log(`Server started on port ${config.PORT}`);
  });
};
