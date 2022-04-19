import HttpStatus from "http-status";
import { receiveOrder } from '../controller/functions.js'

const webhookRoutes = (router) => {
  router
    .post('/webhook/order', async (ctx,next) => {
      console.log('orders hit')
      console.log(ctx.request.body)
      const res = await receiveOrder(ctx.request)
      ctx.status = HttpStatus.OK
      console.log('Order Received! ', res)
      await next()
    })
}

export default webhookRoutes
