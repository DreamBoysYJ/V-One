import express from "express";
import {  certificationsUpload, protectorMiddleware } from "../middlewares.js";
import {getInvoke, postInvoke , getQuery, test, getQueryDetail } from "../controllers/certController.js";

const userRouter = express.Router();

userRouter.get("/:id", test);
userRouter.route("/:id/invoke").all(protectorMiddleware).get(getInvoke).post(certificationsUpload.fields([{name: "pdf"}, {name:"thumb"}]), postInvoke);

userRouter.route("/:id/query").all(protectorMiddleware).get(getQuery);

userRouter.get("/:id/:certid", getQueryDetail);











export default userRouter;
