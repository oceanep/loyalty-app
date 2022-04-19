import HttpStatus from "http-status";
import { getUsers, getUserById, createUser, updateUser } from '../models/users.js'
import { userTierInfo, userOrdersList } from '../controller/functions.js'

const customRoutes = (router) => {
  router
    .get('/users', async (ctx,next) => {
      try {
        const users = await getUsers()
        ctx.status = HttpStatus.OK
        ctx.body = users
      } catch (err){
        ctx.status = 400
      }
      await next()
    })
    .get('/user/:id', async (ctx,next) => {
      try {
        const info = await userTierInfo(ctx.request)
        ctx.status = HttpStatus.OK
        ctx.body = info
      } catch (err){
        ctx.status = 400
      }
    })
    .get('/orders/:userId', async (ctx,next) => {
      try {
        const orders = await userOrdersList(ctx.request)
        ctx.status = HttpStatus.OK
        ctx.body = orders
      } catch (err){
        ctx.status = 400
      }
    })
    .post('/user', async (ctx,next) => {
      try {
        const res = await createUser(ctx.request)
        ctx.status = HttpStatus.OK
        ctx.body = res
      } catch (err){
        ctx.status = 400
      }
    })
    .put('/users/:id', async (ctx,next) => {
      try {
        const res = await updateUser(ctx.request)
        ctx.status = HttpStatus.OK
        ctx.body = res
      } catch (err){
        ctx.status = 400
      }
    })
}
export default customRoutes
