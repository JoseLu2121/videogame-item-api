export class EldenRingItemsSeeder {
  constructor() {
    this.name = "Elden Ring Items";
  }

  async run(db) {
    const collection = db.collection("items");
    console.log("   -> Loading Elden Ring items...");

    let allItems = [];
    let page = 0;
    const limit = 100;
    let hasMoreData = true;

    while (hasMoreData) {
      const url = `https://eldenring.fanapis.com/api/items?limit=${limit}&page=${page}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error loading Elden Ring API on page ${page}: ${response.statusText}`);
      }

      const json = await response.json();
      
      if (json.data && json.data.length > 0) {
        const itemsArray = json.data.map(itemData => {
          return {
            game: "elden-ring",
            er_id: itemData.id,
            image_url: itemData.image,
            ...itemData
          };
        });

        allItems = allItems.concat(itemsArray);
        console.log(`      - Fetched page ${page} (${json.data.length} items)...`);
        page++;
      } else {
        hasMoreData = false;
      }
    }

    if (allItems.length > 0) {
      console.log(`   -> Saving a total of ${allItems.length} Elden Ring items in MongoDB...`);
      await collection.insertMany(allItems);
    } else {
      console.log("   -> No items found to save.");
    }
  }
}