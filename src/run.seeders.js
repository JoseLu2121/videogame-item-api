import mongoose from "mongoose";
import { SeederManager } from "./seeder.manager.js";
import { LeagueItemsSeeder } from "./seeders/item.seeder.lol.js";
import { EldenRingItemsSeeder } from "./seeders/item.seeder.eldenring.js";
import { PokemonItemsSeeder } from "./seeders/item.seeder.pokeapi.js";
import { MonsterHunterItemsSeeder } from "./seeders/item.seeder.monsterhunter.js";
import { XivapiSeeder } from "./seeders/itemseeder.xivapi.js";

import { LolCharactersSeeder } from "./seeders/characters.lol.seeder.js";
import { EldenRingCharactersSeeder } from "./seeders/characters.eldenring.seeder.js";
import { PokemonCharactersSeeder } from "./seeders/characters.pokeapi.seeder.js";
import { Character } from "./models/character.model.js";

import { VideogameSeeder } from "./seeders/videogame.seeder.js";
import { Videogame } from "./models/videogame.model.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/api";

export async function runAllSeeders() {
  if (mongoose.connection.readyState !== 1) {
    console.log("Connecting Mongoose...");
    await mongoose.connect(MONGO_URI);
  }

  const manager = new SeederManager(MONGO_URI);
  manager.addSeeder(new LeagueItemsSeeder());
  manager.addSeeder(new EldenRingItemsSeeder());
  manager.addSeeder(new PokemonItemsSeeder());
  manager.addSeeder(new MonsterHunterItemsSeeder());
  manager.addSeeder(new XivapiSeeder());
  await manager.executeAll();

  console.log("Launching Mongoose character seeders in parallel...");

  await Character.deleteMany({});

  const charactersSeeders = [
    new LolCharactersSeeder().run(),
    new EldenRingCharactersSeeder().run(),
    new PokemonCharactersSeeder().run()
  ];
  await Promise.all(charactersSeeders);
  
  console.log("Mongoose characters seeding completed successfully.");

  await Videogame.deleteMany({});

  const videogameSeeder = [new VideogameSeeder().run()];
  await Promise.all(videogameSeeder)

  console.log("Mongoose videogame seeding completed successfully.");
}

if (process.argv[1] && process.argv[1].includes("run.seeders.js")) {
  runAllSeeders().then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  }).catch(async (err) => {
    console.error(err);
    await mongoose.disconnect();
    process.exit(1);
  });
}
