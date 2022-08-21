import express from "express";
import {  certificationsUpload, protectorMiddleware } from "../middlewares.js";
import {getInvoke, postInvoke , getQuery,getQueryDetail,postQuery, getQuerySearch ,postQuerySearch } from "../controllers/certController.js";

const userRouter = express.Router();


userRouter.route("/:id/invoke").all(protectorMiddleware).get(getInvoke).post(certificationsUpload.fields([{name: "pdf"}, {name:"thumb"}]), postInvoke);

userRouter.route("/:id/query").all(protectorMiddleware).get(getQuery).post(postQuery);

userRouter.route("/:id/querySearch").get(getQuerySearch).post(postQuerySearch);

userRouter.get("/:id/:certid", getQueryDetail);











export default userRouter;
