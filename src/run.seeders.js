import { SeederManager } from "./seeder.manager.js";
import { ItemsSeeder } from "./seeders/seeder.example.js";
import { LeagueItemsSeeder } from "./seeders/seeder.lol.js";
import { EldenRingItemsSeeder } from "./seeders/seeder.eldenring.js";
import { PokemonItemsSeeder } from "./seeders/seeder.pokeapi.js";
import {MonsterHunterItemsSeeder} from "./seeders/seeder.monsterhunter.js";
import { XivapiSeeder } from "./seeders/seeder.xivapi.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

export async function runAllSeeders() {
  const manager = new SeederManager(MONGO_URI);

  manager.addSeeder(new ItemsSeeder());
  manager.addSeeder(new LeagueItemsSeeder());
  manager.addSeeder(new EldenRingItemsSeeder());
  manager.addSeeder(new PokemonItemsSeeder());
  manager.addSeeder(new MonsterHunterItemsSeeder());
  manager.addSeeder(new XivapiSeeder());
  await manager.executeAll();
}

runAllSeeders();
