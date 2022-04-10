import Koa from "koa";
import BodyParser from "koa-bodyparser";
import Router from "koa-router";
import Logger from "koa-logger";
import cors from 'koa-cors';
import serve from "koa-static";
import mount from "koa-mount";

import path from 'path';
const __dirname = path.resolve()

import customRoutes from "./routes/customRoutes.js"

const app = new Koa();

const spa = new Koa();
spa.use(serve(__dirname + "/frontend/build/"));
app.use(mount("/", spa));

app.use(BodyParser());
app.use(Logger());
app.use(cors());

const router = new Router();

customRoutes(router)

app.use(router.routes()).use(router.allowedMethods());

export default app;
