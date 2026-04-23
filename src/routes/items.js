import { Elysia } from "elysia";
import { db } from "../db/mongo.js";

const itemsCollection = db.collection("items");

export const itemsRoutes = new Elysia({ prefix: "/items" })
  .get("/", async () => {
    const items = await itemsCollection.find().toArray();
    return { success: true, data: items };
  })
  .get("/game/:game", async ({ params }) => {
    try {
      const items = await itemsCollection.find({ game: params.game }).toArray();
      return { success: true, count: items.length, data: items };
    } catch (error) {
      return { success: false, message: "Error fetching items by game", error: error.message };
    }
  })
  .get("/name/:name", async ({ params }) => {
    try {
      const items = await itemsCollection.find({ name: { $regex: params.name, $options: "i" } }).toArray();
      return { success: true, count: items.length, data: items };
    } catch (error) {
      return { success: false, message: "Error fetching items by name", error: error.message };
    }
  })
  .get("/game/:game/name/:name", async ({ params }) => {
    try {
      const items = await itemsCollection.find({ 
        game: params.game, 
        name: { $regex: params.name, $options: "i" } 
      }).toArray();
      return { success: true, count: items.length, data: items };
    } catch (error) {
      return { success: false, message: "Error fetching items by game and name", error: error.message };
    }
  })
  .get("/:id", async ({ params }) => {
    return { success: true, message: `Searching item ${params.id}` };
  });