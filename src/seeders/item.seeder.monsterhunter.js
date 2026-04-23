export class MonsterHunterItemsSeeder {
  constructor() {
    this.name = "Monster Hunter Items";
  }

  async run(db) {
    const collection = db.collection("items");

    console.log("   -> Loading Monster Hunter items...");
    const url = "https://mhw-db.com/items";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error loading Monster Hunter API: ${response.statusText}`);
      }

      const itemsData = await response.json();

      const itemsArray = itemsData.map((item) => ({
        game: "monster-hunter",
        ...item
      }));

      console.log(`   -> Saving ${itemsArray.length} items in MongoDB...`);
      await collection.insertMany(itemsArray);
    } catch (error) {
      console.error("   -> Error fetching Monster Hunter items:", error);
      throw error;
    }
  }
}