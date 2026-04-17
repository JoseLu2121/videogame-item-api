import { Elysia } from "elysia";
import { runAllSeeders } from "../run.seeders.js";

export const seedRoutes = new Elysia({ prefix: "/seed" })
  .get("/", async () => {
    try {
      await runAllSeeders();
      return { success: true, message: "All seeders executed successfully" };
    } catch (error) {
      console.error("Error executing seeders:", error);
      return {
        success: false,
        message: "Error executing seeders",
        error: error.message
      };
    }
  });


