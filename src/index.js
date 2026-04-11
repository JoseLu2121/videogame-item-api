import { Elysia } from "elysia";
import { itemsRoutes } from "./routes/items.js";

const app = new Elysia()
  .get("/", () => "Bun server working!")  
  .use(itemsRoutes)
  .listen(3000);

console.log(`Server working at http://${app.server?.hostname}:${app.server?.port}`);