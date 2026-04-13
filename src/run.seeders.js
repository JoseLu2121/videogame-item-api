import { SeederManager } from "./seeder.manager.js";
import { ItemsSeeder } from "./seeders/seeder.example.js";
import { LeagueItemsSeeder } from "./seeders/seeder.lol.js";
import { EldenRingItemsSeeder } from "./seeders/seeder.eldenring.js";
import { PokemonItemsSeeder } from "./seeders/seeder.pokeapi.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

const manager = new SeederManager(MONGO_URI);

manager.addSeeder(new ItemsSeeder());
manager.addSeeder(new LeagueItemsSeeder());
manager.addSeeder(new EldenRingItemsSeeder());
manager.addSeeder(new PokemonItemsSeeder());

manager.executeAll();