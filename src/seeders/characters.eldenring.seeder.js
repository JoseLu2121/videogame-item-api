import { Character } from "../models/character.model.js";

export class EldenRingCharactersSeeder {
	constructor() {
		this.name = "Elden Ring Characters (Mongoose)";
	}

	async run() {
		console.log("   -> Loading Elden Ring characters...");
		try {
			let page = 0;
			let totalSaved = 0;
			let hasMore = true;

			while (hasMore) {
				const response = await fetch(
					`https://eldenring.fanapis.com/api/npcs?limit=100&page=${page}`,
				);
				if (!response.ok) break;

				const json = await response.json();
				if (!json.data || json.data.length === 0) {
					hasMore = false;
					break;
				}

				const docs = json.data.map((npc) => ({
					game: "elden-ring",
					external_id: npc.id,
					name: npc.name,
					title: npc.role || "NPC",
					image_url: npc.image || null,
					tags: (npc.location ? [npc.location] : []).map((location) =>
						location.toLowerCase(),
					),
				}));

				await Character.insertMany(docs);
				totalSaved += docs.length;
				console.log(
					`      - Saved batch of ${docs.length} Elden Ring characters... Total: ${totalSaved}`,
				);
				page++;
			}

			console.log(
				`   -> Saved ${totalSaved} total Elden Ring characters via Mongoose.`,
			);
		} catch (e) {
			console.error(`Error seeding Elden Ring characters: ${e.message}`);
		}
	}
}
