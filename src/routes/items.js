import { Elysia, t } from "elysia";
import { db } from "../db/mongo.js";

const itemsCollection = db.collection("items");

export const itemsRoutes = new Elysia({ prefix: "/items" })
	.get("", async () => {
		try {
			const items = await itemsCollection.find().toArray();
			return { data: items };
		} catch {
			throw new Error("Error fetching items");
		}
	},
		{
			detail: {
				summary: "Get all items",
				description: "Returns all items",
				tags: ["Items"],
			}
		})
	.get("/games", async () => {
		try {
			const games = await itemsCollection.distinct("game");

			return { data: games };
		} catch {
			throw new Error("Error fetching available games");
		}
	},
		{
			detail: {
				summary: "Get item games",
				description: "Returns games from all items",
				tags: ["Items"],
			}
		})
	.get(
		"/game/:game",
		async ({ params }) => {
			try {
				const items = await itemsCollection
					.find({ game: { $regex: params.game, $options: "i" } })
					.toArray();
				return { count: items.length, data: items };
			} catch {
				throw new Error("Error fetching items by game");
			}
		},
		{
			params: t.Object({
				game: t.String(),
			}, { description: "Expects a game"}),
			detail: {
				summary: "Get game items",
				description: "Returns items from a game",
				tags: ["Items"]
			}
		},
	)
	.get(
		"/name/:name",
		async ({ params }) => {
			try {
				const items = await itemsCollection
					.find({ name: { $regex: params.name, $options: "i" } })
					.toArray();
				return { count: items.length, data: items };
			} catch {
				throw new Error("Error fetching items by name");
			}
		},
		{
			params: t.Object({
				name: t.String(),
			}, { description: "Expects a name" }),
			detail: {
				summary: "Get item by name",
				description: "Returns an item by name",
				tags: ["Items"]
			}
		},
	)
	.get(
		"/game/:game/name/:name",
		async ({ params }) => {
			try {
				const items = await itemsCollection
					.find({
						game: { $regex: params.game, $options: "i" },
						name: { $regex: params.name, $options: "i" },
					})
					.toArray();
				return { count: items.length, data: items };
			} catch {
				throw new Error("Error fetching items by game and name");
			}
		},
		{
			params: t.Object({
				name: t.String(),
				game: t.String(),
			}, { description: "Expects a game and name" }),
			detail: {
				summary: "Get item by game and name",
				description: "Returns an item by game and name",
				tags: ["Items"]
			}
		},
	);
