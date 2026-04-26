import { Elysia, t, NotFoundError } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { Videogame } from "../models/videogame.model.js";
import { Rating } from "../models/rating.model.js";


export const videogameRoutes = new Elysia({ prefix: "/videogames" })
	.use(
		jwt({
			name: "jwt",
			secret: Bun.env.JWT_SECRET,
		}),
	)
	.get(
		"",
		async ({ query }) => {
			try {
				const { genres, themes, languages, keywords } = query;
				const filter = {};
				if (genres)    filter.genres    = { $in: genres.split(",").map(g => g.trim()) };
				if (themes)    filter.themes    = { $in: themes.split(",").map(t => t.trim()) };
				if (languages) filter.languages = { $in: languages.split(",").map(l => l.trim()) };
				if (keywords)  filter.keywords  = { $in: keywords.split(",").map(k => k.trim()) };

				const videogames = await Videogame.find(filter);

				return {
					count: videogames.length,
					data: videogames,
				};
			} catch {
				throw new Error("Error fetching videogames");
			}
		},
		{
			query: t.Object({
				genres:    t.Optional(t.String()),
				themes:    t.Optional(t.String()),
				languages: t.Optional(t.String()),
				keywords:  t.Optional(t.String()),
			}, { description: "Optionally expects genres, themes, languages and keywords as query params"}),
			detail: {
				summary: "Get all videogames",
				description: "Returns all videogames.",
				tags: ["Videogames"],
			},
		},
	)
	.get(
		"/genres",
		async () => {
			try {
				const genres = await Videogame.distinct("genres");
				return { count: genres.length, data: genres };
			} catch {
				throw new Error("Error fetching genres");
			}
		},
		{
			detail: {
				summary: "Get videogame genres",
				description: "Returns all videogame genres",
				tags: ["Videogames"],
			},
		},
	)

	.get(
		"/genre/:genre",
		async ({ params }) => {
			try {
				const videogames = await Videogame.find({
					genres: { $regex: params.genre, $options: "i" },
				}).lean();
				return { count: videogames.length, data: videogames };
			} catch {
				throw new Error("Error fetching videogames by genre");
			}
		},
		{
			params: t.Object(
				{
					genre: t.String(),
				},
				{ description: "Expects a genre" },
			),
			detail: {
				summary: "Get videogames by genre",
				description: "Returns videogames by genre",
				tags: ["Videogames"],
			},
		},
	)

	.get(
		"/themes",
		async () => {
			try {
				const themes = await Videogame.distinct("themes");
				return { count: themes.length, data: themes };
			} catch {
				throw new Error("Error fetching themes");
			}
		},
		{
			detail: {
				summary: "Get videogame themes",
				description: "Returns all videogame themes",
				tags: ["Videogames"],
			},
		},
	)

	.get(
		"/theme/:theme",
		async ({ params }) => {
			try {
				const videogames = await Videogame.find({
					themes: { $regex: params.theme, $options: "i" },
				});
				return { count: videogames.length, data: videogames };
			} catch {
				throw new Error("Error fetching videogames by theme");
			}
		},
		{
			params: t.Object(
				{
					theme: t.String(),
				},
				{ description: "Expects a theme" },
			),
			detail: {
				summary: "Get videogames by theme",
				description: "Returns videogames by theme",
				tags: ["Videogames"],
			},
		},
	)

	.get(
		"/languages",
		async () => {
			try {
				const languages = await Videogame.distinct("languages");
				return { count: languages.length, data: languages };
			} catch {
				throw new Error("Error fetching languages");
			}
		},
		{
			detail: {
				summary: "Get videogame languages",
				description: "Returns all videogame languages",
				tags: ["Videogames"],
			},
		},
	)

	.get(
		"/language/:language",
		async ({ params }) => {
			try {
				const videogames = await Videogame.find({
					languages: { $regex: params.language, $options: "i" },
				});
				return { count: videogames.length, data: videogames };
			} catch {
				throw new Error("Error fetching videogames by language");
			}
		},
		{
			params: t.Object(
				{
					language: t.String({ minLength: 1 }),
				},
				{ description: "Expects a language" },
			),
			detail: {
				summary: "Get videogames by language",
				description: "Returns videogames by language",
				tags: ["Videogames"],
			},
		},
	)

	.get(
		"/top",
		async ({ query }) => {
			try {
				const limit = query.limit ?? 10;
				const videogames = await Videogame.find({ rating: { $exists: true } })
					.sort({ rating: -1 })
					.limit(limit)
					.lean();

				return { count: videogames.length, data: videogames };
			} catch {
				throw new Error("Error fetching top videogames");
			}
		},
		{
			query: t.Object(
				{
					limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50 })),
				},
				{ description: "Optionally expects a limit. Default is 10." },
			),
			detail: {
				summary: "Get top videogames",
				description: "Returns top videogames",
				tags: ["Videogames"],
			},
		},
	)

	.get(
		"/recent",
		async ({ query }) => {
			try {
				const limit = query.limit ?? 10;
				const videogames = await Videogame.find({
					first_release_date: { $exists: true, $lte: new Date() },
				})
					.sort({ first_release_date: -1 })
					.limit(limit)

				return { count: videogames.length, data: videogames };
			} catch {
				throw new Error("Error fetching recent videogames");
			}
		},
		{
			query: t.Object(
				{
					limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50 })),
				},
				{ description: "Optionally expects a limit. Default is 10." },
			),
			detail: {
				summary: "Get most recent videogames",
				description: "Returns recent videogames",
				tags: ["Videogames"],
			},
		},
	)
	.get(
		"/:igdb_id",
		async ({ params }) => {
			try {
				const videogame = await Videogame.findOne({
					igdb_id: params.igdb_id,
				}).lean();
				return {
					count: videogame ? 1 : 0,
					data: videogame,
				};
			} catch {
				throw new Error("Error fetching videogame");
			}
		},
		{
			params: t.Object(
				{
					igdb_id: t.Numeric(),
				},
				{ description: "Expects an IGBD id" },
			),
			detail: {
				summary: "Get videogame by IGBD id",
				description: "Returns a videogame from an IGBD id",
				tags: ["Videogames"],
			},
		},
	)
	.get(
		"/id/:id",
		async ({ params }) => {
			const videogame = await Videogame.findById(params.id).lean();
			if (!videogame) {
				throw new NotFoundError("Videogame not found");
			}
			return { data: videogame };
		},
		{
			params: t.Object({ id: t.String() }),
			detail: {
				summary: "Get videogame by MongoDB ID",
				description: "Returns a videogame by its unique database ID",
				tags: ["Videogames"],
			},
		}
	)
	.get(
		"/rating/:id",
		async ({ params, headers, jwt, set }) => {
			try {
				const authHeader = headers.authorization;
				if (!authHeader || !authHeader.startsWith("Bearer ")) {
					return { data: null };
				}

				const token = authHeader.split(" ")[1];
				const profile = await jwt.verify(token);

				if (!profile || !profile.id) {
					return { data: null };
				}

				const videogame = await Videogame.findById(params.id);
				if (!videogame) {
					set.status = 404;
					return { error: "Videogame not found" };
				}

				const existingRating = await Rating.findOne({
					user: profile.id,
					videogame: videogame._id,
				});

				return { data: existingRating || null };
			} catch (error) {
				set.status = 500;
				return { error: "Error fetching user rating" };
			}
		},
		{
			params: t.Object({ id: t.String() }),
			detail: {
				summary: "Get user rating for a videogame",
				description: "Returns the rating given by the authenticated user for a specific videogame, or null if not rated",
				tags: ["Videogames"],
			},
		}
	)
	.post(
		"/rating/:id",
		async ({ params, body, headers, jwt, set }) => {
			try {
				const authHeader = headers.authorization;
				if (!authHeader || !authHeader.startsWith("Bearer ")) {
					set.status = 401;
					return { error: "Unauthorized" };
				}

				const token = authHeader.split(" ")[1];
				const profile = await jwt.verify(token);

				if (!profile || !profile.id) {
					set.status = 401;
					return { error: "Unauthorized" };
				}

				const videogame = await Videogame.findById(params.id);
				if (!videogame) {
					set.status = 404;
					return { error: "Videogame not found" };
				}

				const existingRating = await Rating.findOne({
					user: profile.id,
					videogame: videogame._id,
				});

				let savedRating;

				if (existingRating) {
					const difference = body.rating - existingRating.rating;
					existingRating.rating = body.rating;
					savedRating = await existingRating.save();

					videogame.rating = (videogame.rating || 0) + difference;
					await videogame.save();
				} else {
					const newRating = new Rating({
						user: profile.id,
						videogame: videogame._id,
						rating: body.rating,
					});
					savedRating = await newRating.save();

					videogame.rating = (videogame.rating || 0) + body.rating;
					videogame.rating_count = (videogame.rating_count || 0) + 1;
					await videogame.save();
				}

				return { message: "Rating added/updated successfully", data: savedRating };
			} catch (error) {
				set.status = 500;
				return { error: "Error adding rating" };
			}
		},
		{
			params: t.Object({ id: t.String() }),
			body: t.Object({ rating: t.Numeric({ minimum: 1, maximum: 5 }) }),
			detail: {
				summary: "Rate a videogame",
				description: "Allows an authenticated user to rate a videogame",
				tags: ["Videogames"],
			},
		}
	);
