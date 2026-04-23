export class LeagueItemsSeeder {
  constructor() {
    this.name = "League of Legends Items";
  }

  async run(db) {
    const collection = db.collection("items");
    const count = await collection.countDocuments();

    console.log("   -> Loading league of legends items...");
    const url = "https://ddragon.leagueoflegends.com/cdn/14.2.1/data/en_US/item.json";
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error loading League of Legends API: ${response.statusText}`);
    }

    const json = await response.json();

    const currentVersion = json.version;

    const itemsArray = Object.entries(json.data).map(([id, itemData]) => {
      return {
        game: "league-of-legends",
        lol_id: id,
        image_url: `https://ddragon.leagueoflegends.com/cdn/${currentVersion}/img/item/${id}.png`,
        ...itemData
      };
    });

    console.log(`   -> Saving ${itemsArray.length} items in MongoDB...`);
    await collection.insertMany(itemsArray);
  }
}