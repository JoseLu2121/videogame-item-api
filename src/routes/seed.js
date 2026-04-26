import { Elysia } from "elysia";
import { runAllSeeders } from "../run.seeders.js";

export const seedRoutes = new Elysia({ prefix: "/seed" })
	.get("", async () => {
	try {
		await runAllSeeders();
		return { message: "All seeders executed successfully" };
	} catch {
		throw new Error("Unable to run seeders");
	}
},
		{
			detail: {
				summary: "Seed",
				description: "Populates the DB",
				tags: ["Seeder"],
			}
		});
