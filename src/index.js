import { Elysia } from "elysia";
import { itemsRoutes } from "./routes/items.js";
import { seedRoutes } from "./routes/seed.js";

const app = new Elysia()
  .get("/", () => "Bun server working!")  
  .use(itemsRoutes)
  .use(seedRoutes)
  .listen(3000);

console.log(`Server working at http://${app.server?.hostname}:${app.server?.port}`);