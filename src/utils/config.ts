const MONGODB_URI = process.env.MONGODB_URI || "";
const PORT = process.env.PORT || 4001;
const SESSION_SECRET = process.env.SESSION_SECRET || "lol";

export default {
  MONGODB_URI,
  PORT,
  SESSION_SECRET,
};
