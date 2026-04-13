import { SeederManager } from "./seeder.manager.js";
import { ItemsSeeder } from "./seeders/seeder.example.js";
import { LeagueItemsSeeder } from "./seeders/seeder.lol.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

const manager = new SeederManager(MONGO_URI);

manager.addSeeder(new ItemsSeeder());
manager.addSeeder(new LeagueItemsSeeder());
manager.executeAll();