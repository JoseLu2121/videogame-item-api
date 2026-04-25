import { Elysia } from "elysia";
import { Character } from "../models/character.model.js";

export const charactersRoutes = new Elysia({ prefix: "/characters" })
  .get("/", async () => {
    try {
      const characters = await Character.find({});
      return {
        success: true,
        count: characters.length,
        data: characters,
      };
    } catch (error) {
      console.error("Error fetching characters:", error);
      return {
        success: false,
        message: "Error fetching characters",
        error: error.message,
      };
    }
  })
  .get("/games", async () => {
    try {
      const games = await Character.distinct("game");

      return {
        success: true,
        count: games.length,
        data: games,
      };
    } catch (error) {
      console.error("Error fetching character games:", error);
      return {
        success: false,
        message: "Error fetching character games",
        error: error.message,
      };
    }
  })
  .get("/game/:game", async ({ params }) => {
    try {
      const characters = await Character.find({ game: params.game });
      return {
        success: true,
        count: characters.length,
        data: characters,
      };
    } catch (error) {
      console.error("Error fetching characters by game:", error);
      return {
        success: false,
        message: "Error fetching characters by game",
        error: error.message,
      };
    }
  }).get("/name/:name", async ({ params }) => {
      try {
        const characters = await Character.find({ name: params.name });
        return {
          success: true,
          count: characters.length,
          data: characters,
        };
      } catch (error) {
        console.error("Error fetching characters by game:", error);
        return {
          success: false,
          message: "Error fetching characters by game",
          error: error.message,
        };
      }})
    .get("/game/:game/name/:name", async ({ params }) => {
      try {
        const characters = await Character.find({ game: params.game, name: params.name });
        return {
          success: true,
          count: characters.length,
          data: characters,
        };
      } catch (error) {
        console.error("Error fetching characters by game:", error);
        return {
          success: false,
          message: "Error fetching characters by game",
          error: error.message,
        };
      }})

