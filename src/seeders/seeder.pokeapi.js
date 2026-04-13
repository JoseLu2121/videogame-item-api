export class PokemonItemsSeeder {
  constructor() {
    this.name = "Pokemon Items";
  }

  async run(db) {
    const collection = db.collection("items");
    console.log("   -> Loading Pokemon items...");

    let allItems = [];
    let nextUrl = "https://pokeapi.co/api/v2/item?limit=100"; 

    while (nextUrl) {
      const response = await fetch(nextUrl);
      
      if (!response.ok) {
        throw new Error(`Error loading PokeAPI: ${response.statusText}`);
      }

      const json = await response.json();

      const detailedItemsPromises = json.results.map(async (basicItem) => {
        const detailResponse = await fetch(basicItem.url);
        const itemData = await detailResponse.json();

        return {
          game: "pokemon",
          poke_id: itemData.id,
          name: itemData.name,
          cost: itemData.cost,
          image_url: itemData.sprites.default,
          category: itemData.category.name,
        };
      });

      const itemsArray = (await Promise.all(detailedItemsPromises)).filter(item => item.image_url != null);
      
      allItems = allItems.concat(itemsArray);
      console.log(`      - Fetched batch... Total items so far: ${allItems.length}`);

      nextUrl = json.next; 
    }

    if (allItems.length > 0) {
      console.log(`   -> Saving a total of ${allItems.length} Pokemon items in MongoDB...`);
      await collection.insertMany(allItems);
    } else {
      console.log("   -> No items found to save.");
    }
  }
}