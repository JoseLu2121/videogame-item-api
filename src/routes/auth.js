import { jwt } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { Rating } from "../models/rating.model.js";
import { User } from "../models/user.model.js";

export const authRoutes = new Elysia({ prefix: "/auth" })
	.use(
		jwt({
			name: "jwt",
			secret: Bun.env.JWT_SECRET,
		}),
	)
	.get(
		"",
		() => {
			return { message: "Auth working correctly" };
		},
		{
			detail: {
				summary: "Health check",
				description:
					"Returns a message if the auth routes are working correctly",
				tags: ["Auth"],
			},
		},
	)
	.post(
		"/register",
		async ({ body, jwt, set }) => {
			const { email, password } = body;

			const userExists = await User.findOne({ email });
			if (userExists) {
				set.status = 400;
				return { error: "Email currently in database." };
			}

			const hashedPassword = await Bun.password.hash(password);
			const newUser = await User.create({ email, password: hashedPassword });

			const token = await jwt.sign({ id: newUser._id.toString() });

			return { message: "User created", id: newUser._id, token };
		},
		{
			body: t.Object(
				{
					email: t.String({ description: "Desired user email" }),
					password: t.String({ description: "Desired user password" }),
				},
				{ description: "Expects a user email and password" },
			),
			detail: {
				summary: "Register",
				description: "Registers a new user",
				tags: ["Auth"],
			},
		},
	)
	.post(
		"/login",
		async ({ body, jwt, set }) => {
			const { email, password } = body;

			const user = await User.findOne({ email });
			if (!user) {
				set.status = 401;
				return { error: "Invalid credentials" };
			}

			const isValid = await Bun.password.verify(password, user.password);
			if (!isValid) {
				set.status = 401;
				return { error: "Invalid credentials" };
			}

			const token = await jwt.sign({ id: user._id.toString() });
			return { message: "Login successful", token };
		},
		{
			body: t.Object(
				{
					email: t.String({ description: "User email" }),
					password: t.String({ description: "User password" }),
				},
				{
					description:
						"Expects a previously registered user email and password",
				},
			),
			detail: {
				summary: "Login",
				description: "Logins a user",
				tags: ["Auth"],
			},
		},
	)
	.get(
		"/profile",
		async ({ headers, jwt, set }) => {
			try {
				const authHeader = headers.authorization;
				if (!authHeader || !authHeader.startsWith("Bearer ")) {
					set.status = 401;
					return { error: "Unauthorized" };
				}

				const token = authHeader.split(" ")[1];
				const decoded = await jwt.verify(token);

				if (!decoded || !decoded.id) {
					set.status = 401;
					return { error: "Unauthorized" };
				}

				const user = await User.findById(decoded.id).select("-password").lean();
				if (!user) {
					set.status = 404;
					return { error: "User not found" };
				}

				const ratings = await Rating.find({ user: decoded.id })
					.populate("videogame")
					.lean();

				return { user, ratings };
			} catch (error) {
				set.status = 500;
				return { error: "Error fetching profile data" };
			}
		},
		{
			detail: {
				summary: "Get user profile and ratings",
				description:
					"Returns the authenticated user's details and all their rated videogames",
				tags: ["Auth"],
			},
		},
	);
