import { Elysia } from "elysia";
import mongoose from "mongoose";
import { itemsRoutes } from "./routes/items.js";
import { seedRoutes } from "./routes/seed.js";
import { charactersRoutes } from "./routes/characters.js";
import { cors } from "@elysiajs/cors";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/api";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Mongoose connected successfully."))
  .catch(err => console.error("Mongoose connection error:", err));

const app = new Elysia().use(cors())
  .get("/", () => "Bun server working!")  
  .use(itemsRoutes)
  .use(charactersRoutes)
  .use(seedRoutes)
  .listen(3000);

console.log(`Server working at http://${app.server?.hostname}:${app.server?.port}`);