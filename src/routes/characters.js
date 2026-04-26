import { Elysia, t } from "elysia";
import { Character } from "../models/character.model.js";

export const charactersRoutes = new Elysia({ prefix: "/characters" })
	.get("", async () => {
		try {
			const characters = await Character.find({});
			return {
				count: characters.length,
				data: characters,
			};
		} catch {
			throw new Error("Error fetching characters");
		}
	}, {
		detail: {
			summary: "Get all characters",
			description: "Returns all characters",
			tags: ["Characters"],
		}
	})
	.get("/games", async () => {
		try {
			const games = await Character.distinct("game");

			return {
				count: games.length,
				data: games,
			};
		} catch {
			throw new Error("Error fetching character games");
		}
	}, {
		detail: {
			summary: "Get character games",
			description: "Returns games from all characters",
			tags: ["Characters"],
		}
	})
	.get(
		"/game/:game",
		async ({ params, query }) => {
			try {
				const filter = { game: { $regex: params.game, $options: "i" } };
                if (query.tags) {
                    filter.tags = { $all: query.tags.split(",").map(tag => tag.toLowerCase()) };
                }

				const characters = await Character.find(filter);

				return {
					count: characters.length,
					data: characters,
				};
			} catch {
				throw new Error("Error fetching characters from game");
			}
		},
		{
			params: t.Object({
				game: t.String(),
			}, { description: "Expects a game"}),
			query: t.Object({
				tags: t.Optional(t.String()),
			}, { description: "Optionally, character tags can be added to the query"}),
			detail: {
				summary: "Get game characters",
				description: "Returns characters from a game. Additionally, fetched characters can be filtered by tags",
				tags: ["Characters"]
			}
		},
	)
	.get(
		"/name/:name",
		async ({ params }) => {
			try {
				const characters = await Character.find({ name: { $regex: params.name, $options: "i" } });
				return {
					count: characters.length,
					data: characters,
				};
			} catch {
				throw new Error("Error fetching characters from name");
			}
		},
		{
			params: t.Object({
				name: t.String(),
			}, { description: "Expects a character name"}),
			detail: {
				summary: "Get character by name",
				description: "Returns a character by name",
				tags: ["Characters"]
			}
		},
	)
	.get(
		"/game/:game/name/:name",
		async ({ params }) => {
			try {
				const characters = await Character.find({
					game: { $regex: params.game, $options: "i" },
					name: { $regex: params.name, $options: "i" },
				}, { description: "Expects a character game and name"});
				return {
					count: characters.length,
					data: characters,
				};
			} catch {
				throw new Error("Error fetching characters from game and name");
			}
		},
		{
			params: t.Object({
				name: t.String(),
				game: t.String(),
			}),
			detail: {
				summary: "Get character by name and game",
				description: "Returns a character by name and game",
				tags: ["Characters"]
			}
		},
	)
	.get(
		"game/:game/tags",
		async ({ params }) => {
			try {
				const tags = await Character.aggregate([
					{ $match: { game: { $regex: params.game, $options: "i" } } },

					{ $unwind: "$tags" },

					{ $group: { _id: "$tags" } },

					{ $sort: { _id: 1 } },
				]);

				return tags.map((t) => t._id);
			} catch {
				throw new Error("Error fetching tags from game");
			}
		},
		{
			params: t.Object({
				game: t.String(),
			}, { description: "Expects a game"}),
			detail: {
				summary: "Get tags from a game",
				description: "Returns tags from a game",
				tags: ["Characters"]
			}
		},
	);
