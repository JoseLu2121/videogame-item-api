import { Elysia } from "elysia";
import { db } from "../db/mongo.js";

const itemsCollection = db.collection("items");

export const itemsRoutes = new Elysia({ prefix: "/items" })
  .get("/", async () => {
    const items = await itemsCollection.find().toArray();
    return { success: true, data: items };
  })
  .get("/:id", async ({ params }) => {
    return { success: true, message: `Searching item ${params.id}` };
  });