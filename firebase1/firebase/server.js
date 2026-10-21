import express from "express";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const keyPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "serviceAccountKey.json");

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));
} catch {
  console.error("Missing or invalid serviceAccountKey.json. Add your Firebase service-account JSON key to this project folder.");
  process.exit(1);
}

const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);
const records = db.collection("records");
const server = express();
server.use(express.json({ limit: "1mb" }));

server.get("/api/records", async (_request, response) => {
  try {
    const snapshot = await records.orderBy("createdAt", "desc").get();
    response.json(snapshot.docs.map(item => ({ id: item.id, ...item.data() })));
  } catch (error) {
    console.error("Firestore read failed:", error);
    response.status(500).send(error.message);
  }
});

server.post("/api/records", async (request, response) => {
  const { title, description } = request.body ?? {};
  if (typeof title !== "string" || !title.trim() || typeof description !== "string" || !description.trim()) {
    return response.status(400).send("Title and description are required.");
  }
  try {
    const result = await records.add({ title: title.trim(), description: description.trim(), createdAt: new Date() });
    response.status(201).json({ id: result.id });
  } catch (error) {
    console.error("Firestore create failed:", error);
    response.status(500).send(error.message);
  }
});

server.put("/api/records/:id", async (request, response) => {
  const { title, description } = request.body ?? {};
  if (typeof title !== "string" || !title.trim() || typeof description !== "string" || !description.trim()) {
    return response.status(400).send("Title and description are required.");
  }
  try {
    await records.doc(request.params.id).update({ title: title.trim(), description: description.trim() });
    response.sendStatus(204);
  } catch (error) {
    console.error("Firestore update failed:", error);
    response.status(error.code === 5 ? 404 : 500).send(error.message);
  }
});

server.delete("/api/records/:id", async (request, response) => {
  try {
    await records.doc(request.params.id).delete();
    response.sendStatus(204);
  } catch (error) {
    console.error("Firestore delete failed:", error);
    response.status(500).send(error.message);
  }
});

server.listen(3001, "127.0.0.1", () => {
  console.log("Firebase API ready at http://127.0.0.1:3001");
});
