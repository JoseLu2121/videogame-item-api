import { Elysia } from "elysia";
import { Character } from "../models/character.model.js";

export const charactersRoutes = new Elysia({ prefix: "/characters" })
  .get("/", async () => {
    try {
      const characters = await Character.find({});
      return { 
        success: true, 
        count: characters.length, 
        data: characters 
      };
    } catch (error) {
      console.error("Error fetching characters:", error);
      return {
        success: false,
        message: "Error fetching characters",
        error: error.message
      };
    }
  });
