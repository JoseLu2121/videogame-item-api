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
  .get("/game/:game", async ({ params, query, set }) => {
    try {

      const filter = {game: params.game}
      if(query.tags) {
        const tagsInRequest = query.tags.split(',');
        filter.tags = { $all: tagsInRequest };
      }

      const characters = await Character.find(filter);

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
    .get("game/:game/tags", async({ params, set}) => {
      try{

        const tags = await Character.aggregate([
          { $match: { game: params.game } }, 
        
          { $unwind: '$tags' },
        
          { $group: { _id: '$tags' } },
        
          { $sort: { _id: 1 } }
        ]);

        return tags.map(t => t._id);
      
    }catch(error){
      set.status = 500
      return { error: 'Error obtaining tags'}
    }
  })
