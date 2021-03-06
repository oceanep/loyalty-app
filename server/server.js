import Koa from "koa";
import BodyParser from "koa-bodyparser";
import Router from "koa-router";
import Logger from "koa-logger";
import cors from 'koa-cors';
import serve from "koa-static";
import mount from "koa-mount";
import fs from "fs";

import path from 'path';
const __dirname = path.resolve()

import customRoutes from "./routes/customRoutes.js"
import webhookRoutes from "./routes/webhookRoutes.js"
import tiersCron from './controller/tiersCron.js'

const app = new Koa();

const spa = new Koa();
spa.use(serve(__dirname + "/frontend/build/"));
app.use(mount("/", spa));

app.use(BodyParser());
app.use(Logger());
app.use(cors());

const router = new Router();

customRoutes(router)
webhookRoutes(router)
router.get(/.*/, async (ctx, next) => {
  const html = fs.readFileSync(__dirname + '/frontend/build/index.html')
  ctx.type = 'html'
  ctx.body = html
})

app.use(router.routes()).use(router.allowedMethods());

export default app;
