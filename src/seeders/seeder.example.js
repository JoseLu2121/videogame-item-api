export class ItemsSeeder {
  constructor() {
    this.name = "Seeder example";
  }

  async run(db) {
    const collection = db.collection("items");
    
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log("   -> Items already exists, skipping...");
      return;
    }

    const data = [{ name: "Large Sword", damage: 50 }, { name: "Shield", defense: 100 }];
    await collection.insertMany(data);
  }
}