import express from "express";

const app = express();
const port = Number(process.env.PORT || 3002);
const upstream = "https://jsonplaceholder.typicode.com";

app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", thirdPartyApi: "JSONPlaceholder" });
});

app.get("/api/posts", async (request, response) => {
  const requestedLimit = Number.parseInt(request.query.limit, 10) || 5;
  const limit = Math.min(Math.max(requestedLimit, 1), 100);

  try {
    const result = await fetch(`${upstream}/posts?_limit=${limit}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!result.ok) return response.status(result.status).json({ error: "Third-party API request failed." });
    response.json(await result.json());
  } catch (error) {
    console.error("Third-party API request failed:", error.message);
    response.status(502).json({ error: "Could not reach JSONPlaceholder. Check your internet connection." });
  }
});

app.get("/api/posts/:id", async (request, response) => {
  if (!/^\d+$/.test(request.params.id)) return response.status(400).json({ error: "Post ID must be a number." });

  try {
    const result = await fetch(`${upstream}/posts/${request.params.id}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (result.status === 404) return response.status(404).json({ error: "Post not found." });
    if (!result.ok) return response.status(result.status).json({ error: "Third-party API request failed." });
    response.json(await result.json());
  } catch (error) {
    console.error("Third-party API request failed:", error.message);
    response.status(502).json({ error: "Could not reach JSONPlaceholder. Check your internet connection." });
  }
});

app.post("/api/posts", async (request, response) => {
  const { title, body, userId = 1 } = request.body ?? {};
  if (typeof title !== "string" || !title.trim() || typeof body !== "string" || !body.trim()) {
    return response.status(400).json({ error: "A title and body are required." });
  }

  try {
    const result = await fetch(`${upstream}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ title: title.trim(), body: body.trim(), userId }),
      signal: AbortSignal.timeout(10000),
    });
    if (!result.ok) return response.status(result.status).json({ error: "Third-party API request failed." });
    response.status(result.status).json(await result.json());
  } catch (error) {
    console.error("Third-party API request failed:", error.message);
    response.status(502).json({ error: "Could not reach JSONPlaceholder. Check your internet connection." });
  }
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Third-party API demo listening at http://127.0.0.1:${port}`);
});
