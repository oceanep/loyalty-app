import HttpStatus from "http-status";

const customRoutes = (router) => {
  router.get("/book",async (ctx,next)=>{
    const books = ["Speaking javascript", "Fluent Python", "Pro Python", "The Go programming language"];
    ctx.status = HttpStatus.OK;
    ctx.body = books;
    await next();
  });
}
export default customRoutes
