import { Character } from "../models/character.model.js";

export class PokemonCharactersSeeder {
  constructor() {
    this.name = "Pokemon Characters (Mongoose)";
  }

  async run() {
    console.log("   -> Loading Pokemon characters...");
    try {
      let page = 0;
      let nextUrl = "https://pokeapi.co/api/v2/pokemon?limit=100";
      let totalSaved = 0;

      while (nextUrl) {
        const response = await fetch(nextUrl);
        const json = await response.json();

        const docs = [];
        const chunkSize = 20;

        for (let i = 0; i < json.results.length; i += chunkSize) {
          const chunk = json.results.slice(i, i + chunkSize);
          const detailedPromises = chunk.map(async (basic) => {
            const detailResponse = await fetch(basic.url);
            const data = await detailResponse.json();
            return {
              game: "pokemon",
              external_id: data.id.toString(),
              name: data.name,
              title: "Pokemon",
              image_url: data.sprites.front_default,
              tags: data.types.map(t => t.type.name),
            };
          });

          const chunkResults = await Promise.all(detailedPromises);
          docs.push(...chunkResults.filter(p => p.image_url != null));
        }

        if (docs.length > 0) {
          await Character.insertMany(docs);
          totalSaved += docs.length;
          console.log(`      - Saved batch of ${docs.length} Pokemon... Total: ${totalSaved}`);
        }

        nextUrl = json.next;
        page++;
      }

      console.log(`   -> Saved ${totalSaved} total Pokemon characters via Mongoose.`);
    } catch (e) {
      console.error(`Error seeding Pokemon characters: ${e.message}`);
    }
  }
}
