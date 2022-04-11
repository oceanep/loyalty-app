import HttpStatus from "http-status";
import { getUsers, getUserById, createUser, updateUser } from '../models/queries.js'

const customRoutes = (router) => {
  router
    .get('/users', async (ctx,next) => {
      try {
        const users = await getUsers()
        ctx.status = HttpStatus.OK
        ctx.body = users
      } catch (err){
        ctx.status = HttpStatus.BadRequest
      }
      await next()
    })
    .get('/users/:id', async (ctx,next) => {
      try {
        const user = await getUserById(ctx.request)
        ctx.status = HttpStatus.OK
        ctx.body = user
      } catch (err){
        ctx.status = HttpStatus.BadRequest
      }
    })
    .post('/users', async (ctx,next) => {
      try {
        const res = await createUser(ctx.request)
        ctx.status = HttpStatus.OK
        ctx.body = res
      } catch (err){
        ctx.status = HttpStatus.BadRequest
      }
    })
    .put('/users/:id', async (ctx,next) => {
      try {
        const res = await updateUser(ctx.request)
        ctx.status = HttpStatus.OK
        ctx.body = res
      } catch (err){
        ctx.status = HttpStatus.BadRequest
      }
    })
}
export default customRoutes
