import express from "express";
import { getQueryDetail } from "../controllers/certController.js";
import { home } from "../controllers/home.js";
import {getJoin,  postJoin, getLogin, postLogin, logout} from "../controllers/userController.js";
import {protectorMiddleware, publicOnlyMiddleware} from "../middlewares.js";




const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);
rootRouter.get("/logout", protectorMiddleware, logout);

rootRouter.get("/query/:id").get(getQueryDetail);


export default rootRouter;