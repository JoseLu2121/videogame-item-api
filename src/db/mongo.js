import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

await client.connect();
console.log("Connecting to MongoDB");

export const db = client.db("api");

export { client };