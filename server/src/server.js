import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";

import organRouter from "./routers/organRouter.js";
import rootRouter from "./routers/rootRouter.js";
import userRouter from "./routers/userRouter.js";
import "./db.js";
import { localsMiddleware } from "./middlewares.js";
import flash from "express-flash";

const app = express();

const logger = morgan("dev");


app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    })
  );

app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));



app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/organs", organRouter);



export default app;




