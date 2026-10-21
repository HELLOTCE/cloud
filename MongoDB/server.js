import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Paste your MongoDB Atlas connection string here. Keep this file private;
// the URI contains database credentials and must never go into browser code.
const MONGODB_URI = "YOUR_MONGODB_ATLAS_URI";
const MONGODB_DB = "mongodb_demo";
const PORT = 3000;

if (MONGODB_URI === "YOUR_MONGODB_ATLAS_URI") {
  console.error("Paste your MongoDB Atlas connection string into MONGODB_URI in server.js.");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);
const app = express();
const thisDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.join(thisDirectory, "public");

app.use(express.json({ limit: "1mb" }));
app.use(express.static(publicDirectory));

function validObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

function getTextRecord(body) {
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  if (!title || !description) return null;
  return { title, description };
}

app.get("/api/records", async (_request, response, next) => {
  try {
    const items = await client.db(MONGODB_DB).collection("records")
      .find({}, { projection: { title: 1, description: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .toArray();
    response.json(items.map(item => ({ ...item, id: item._id.toString(), _id: undefined })));
  } catch (error) {
    next(error);
  }
});

app.post("/api/records", async (request, response, next) => {
  const record = getTextRecord(request.body);
  if (!record) return response.status(400).json({ error: "Enter a title and description." });

  try {
    const result = await client.db(MONGODB_DB).collection("records").insertOne({
      ...record,
      createdAt: new Date(),
    });
    response.status(201).json({ id: result.insertedId.toString() });
  } catch (error) {
    next(error);
  }
});

app.put("/api/records/:id", async (request, response, next) => {
  if (!validObjectId(request.params.id)) return response.status(400).json({ error: "Invalid record ID." });
  const record = getTextRecord(request.body);
  if (!record) return response.status(400).json({ error: "Enter a title and description." });

  try {
    const result = await client.db(MONGODB_DB).collection("records").updateOne(
      { _id: new ObjectId(request.params.id) },
      { $set: record },
    );
    if (!result.matchedCount) return response.status(404).json({ error: "Record not found." });
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/records/:id", async (request, response, next) => {
  if (!validObjectId(request.params.id)) return response.status(400).json({ error: "Invalid record ID." });

  try {
    const result = await client.db(MONGODB_DB).collection("records").deleteOne({
      _id: new ObjectId(request.params.id),
    });
    if (!result.deletedCount) return response.status(404).json({ error: "Record not found." });
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error("MongoDB request failed:", error);
  response.status(500).json({ error: "Database request failed. Check the terminal for details." });
});

try {
  await client.connect();
  await client.db(MONGODB_DB).command({ ping: 1 });
  app.listen(Number(PORT), "127.0.0.1", () => {
    console.log(`MongoDB CRUD app: http://127.0.0.1:${PORT}`);
    console.log(`Database: ${MONGODB_DB} | Collection: records`);
  });
} catch (error) {
  console.error("Could not connect to MongoDB. Check MONGODB_URI, database-user credentials, and Atlas Network Access.");
  console.error(error.message);
  await client.close().catch(() => {});
  process.exit(1);
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    await client.close();
    process.exit(0);
  });
}
