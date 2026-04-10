import { Elysia, t } from "elysia";
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

await client.connect();
console.log("MongoDB conectado a JS");

const db = client.db("mi_api_db");
const usersCollection = db.collection("users");

const app = new Elysia()
  .get("/", () => "¡API con Bun, Elysia y JS Puro funcionando!")
  
  .get("/users", async () => {
    const users = await usersCollection.find().toArray();
    return { success: true, data: users };
  })
  
  .post("/users", async ({ body }) => {
    const newUser = {
      name: body.name,
      email: body.email,
      createdAt: new Date(),
    };
    const result = await usersCollection.insertOne(newUser);
    return { success: true, data: { _id: result.insertedId, ...newUser } };
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String()
    })
  })
  .listen(3000);

console.log(`Servidor corriendo en http://${app.server?.hostname}:${app.server?.port}`);