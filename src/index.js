import { openapi } from "@elysia/openapi";
import { cors } from "@elysiajs/cors";
import { serverTiming } from '@elysia/server-timing'
import { Elysia } from "elysia";
import mongoose from "mongoose";
import { authRoutes } from "./routes/auth.js";
import { charactersRoutes } from "./routes/characters.js";
import { itemsRoutes } from "./routes/items.js";
import { seedRoutes } from "./routes/seed.js";
import { videogameRoutes } from "./routes/videogames.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/api";

mongoose
	.connect(MONGO_URI)
	.then(() => console.log("Mongoose connected successfully."))
	.catch((err) => console.error("Mongoose connection error:", err));

const app = new Elysia()
	.use(cors())
	.use(serverTiming())
	.use(
		openapi({
			documentation: {
				info: {
					title: "BlitzDrop API",
					version: "1.0.0",
				},
				tags: [
					{ name: "General", description: "General routes" },
					{ name: "Auth", description: "Authentication routes" },
					{ name: "Characters", description: "Character routes" },
					{ name: "Videogames", description: "Videogame routes" },
					{ name: "Items", description: "Items routes" },
					{ name: "Seeder", description: "Seeding routes" },
				],
			},
		}),
	)
	.onError(({ code, status, error }) => {
		if (code === "NOT_FOUND") {
			return status(404, { message: "Route not found" });
		}
		return status(500, { message: error.message ?? "Internal error" });
	})
	.get("/", () => "BlitzDrop API working!", {
		detail: {
			summary: "Health check",
			tags: ["General"],
		},
	})
	.use(authRoutes)
	.use(itemsRoutes)
	.use(charactersRoutes)
	.use(videogameRoutes)
	.use(seedRoutes)
	.listen(3000);

console.log(
	`Server working at http://${app.server?.hostname}:${app.server?.port}`,
);
