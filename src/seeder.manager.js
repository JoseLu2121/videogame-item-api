import { MongoClient } from "mongodb";

export class SeederManager {
	constructor(uri) {
		this.client = new MongoClient(uri);
		this.seeders = [];
	}

	addSeeder(seeder) {
		this.seeders.push(seeder);
	}

	async executeAll() {
		try {
			console.log("Connecting to MongoDB for seeding...");
			await this.client.connect();
			const db = this.client.db("api");

			console.log(`Initializing ${this.seeders.length} seeders...`);

			for (const seeder of this.seeders) {
				console.log(`Executing seeder: ${seeder.name}...`);
				await seeder.run(db);
				console.log(`Seeder ${seeder.name} completed.`);
			}

			console.log("Every seeder launched successfully.");
		} catch (error) {
			console.error("Error while executing seeders:", error);
			process.exit(1);
		} finally {
			await this.client.close();
		}
	}
}
