import { Character } from "../models/character.model.js";

export class LolCharactersSeeder {
	constructor() {
		this.name = "LoL Characters (Mongoose)";
	}

	async run() {
		console.log("   -> Loading LoL characters...");
		try {
			const response = await fetch(
				"https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/champion.json",
			);
			const json = await response.json();
			const champions = Object.values(json.data);

			const docs = champions.map((champ) => ({
				game: "league-of-legends",
				external_id: champ.id,
				name: champ.name,
				title: champ.title,
				image_url: `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${champ.image.full}`,
				tags: champ.tags.map(tag => tag.toLowerCase()),
			}));

			await Character.insertMany(docs);
			console.log(`   -> Saved ${docs.length} LoL characters via Mongoose.`);
		} catch (e) {
			console.error(`Error seeding LoL characters: ${e.message}`);
		}
	}
}
