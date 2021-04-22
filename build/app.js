"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var path_1 = __importDefault(require("path"));
var config_1 = __importDefault(require("./utils/config"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var app = express_1.default();
//TEMPLATE ENGINE
app.set("views", path_1.default.join(__dirname, "../views"));
app.set("view engine", "pug");
//MIDDLEWARE
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var express_session_1 = __importDefault(require("express-session"));
var passport_1 = __importDefault(require("passport"));
var passport_local_1 = require("passport-local");
var connect_mongo_1 = __importDefault(require("connect-mongo"));
var user_1 = __importDefault(require("./models/user"));
app.use(cors_1.default());
var DBconnection = mongoose_1.default
    .connect(config_1.default.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .then(function (m) { return m.connection.getClient(); });
// PASSPORT AUTH & SESSIONS
app.use(express_session_1.default({
    secret: config_1.default.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: connect_mongo_1.default.create({
        clientPromise: DBconnection,
        collectionName: "sessions",
    }),
    cookie: {
        maxAge: 7000 * 60 * 60 * 24, // 7 days
    },
}));
passport_1.default.use(new passport_local_1.Strategy(function (username, password, done) { return __awaiter(void 0, void 0, void 0, function () {
    var user, match, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, user_1.default.findOne({ username: username })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, done(null, false, { message: "Incorrect username" })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 2:
                match = _a.sent();
                if (match) {
                    return [2 /*return*/, done(null, user)];
                }
                else {
                    return [2 /*return*/, done(null, false, { message: "Incorrect password" })];
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, done(err_1)];
            case 4: return [2 /*return*/];
        }
    });
}); }));
passport_1.default.serializeUser(function (req, user, done) {
    done(undefined, user.id);
});
passport_1.default.deserializeUser(function (id, done) {
    user_1.default.findById(id, function (err, user) {
        done(err, user);
    });
});
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(morgan_1.default("dev"));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
//ROUTERS
var messageRouter_1 = __importDefault(require("./routers/messageRouter"));
var membershipRouter_1 = __importDefault(require("./routers/membershipRouter"));
var authRouter_1 = __importDefault(require("./routers/authRouter"));
var protectRoute = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect("/login");
    }
};
app.use("/", authRouter_1.default);
app.use("/message", protectRoute, messageRouter_1.default);
app.use("/membership", protectRoute, membershipRouter_1.default);
// DEFAULT ROUTES
var message_1 = __importDefault(require("./models/message"));
app.get("/", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var docs, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, message_1.default.find()
                        .sort({ timestamp: "desc" })
                        .lean()
                        .populate("author")
                        .exec()];
            case 1:
                docs = _a.sent();
                res.render("index", { messages: docs });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.log(err_2);
                next(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//START
exports.default = (function () {
    app.listen(config_1.default.PORT, function () {
        console.log("Server started on port " + config_1.default.PORT);
    });
});
