export class XivapiSeeder {
	constructor() {
		this.name = "Final Fantasy XIV Items";
	}

	async run(db) {
		const collection = db.collection("items");

		console.log("   -> Loading Final Fantasy XIV items...");

		const allResults = [];
		let after = null;

		do {
			const url = new URL("https://v2.xivapi.com/api/sheet/Item");
			url.searchParams.set("limit", "500");
			url.searchParams.set(
				"fields",
				"Name,Description,Icon,LevelItem,ItemUICategory.Name,StackSize",
			);
			if (after) url.searchParams.set("after", after);

			const res = await fetch(url.toString());
			if (!res.ok)
				throw new Error(`XIVAPI error: ${res.status} ${res.statusText}`);
			const response = await res.json();

			allResults.push(...response.rows);
			after = response.next ?? null;
		} while (after);

		const itemsArray = allResults
			.filter(
				(result) => result.fields.Name && result.fields.Name.trim() !== "",
			)
			.map((result) => ({
				game: "final-fantasy-xiv",
				xiv_id: result.row_id,
				image_url: `https://v2.xivapi.com/api/asset/${result.fields.Icon.path_hr1}?format=png`,
				name: result.fields.Name,
				description: result.fields.Description ?? null,
				item_level: result.fields.LevelItem.value ?? 0,
			}));

		console.log(`   -> Saving ${itemsArray.length} items in MongoDB...`);
		await collection.insertMany(itemsArray);
	}
}
