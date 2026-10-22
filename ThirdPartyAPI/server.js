import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT || 3002);
const publicDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "public");

app.use(express.static(publicDirectory));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", thirdPartyApi: "Frankfurter" });
});

app.get("/api/convert", async (request, response) => {
  const amount = Number(request.query.amount);
  const from = String(request.query.from || "").toUpperCase();
  const to = String(request.query.to || "").toUpperCase();

  if (!Number.isFinite(amount) || amount < 0) {
    return response.status(400).json({ error: "Amount must be a number greater than or equal to zero." });
  }
  if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to)) {
    return response.status(400).json({ error: "Enter valid three-letter currency codes." });
  }
  if (from === to) {
    return response.json({ amount, from, to, rate: 1, result: amount, date: null });
  }

  try {
    const upstream = await fetch(`https://api.frankfurter.dev/v2/rate/${from.toLowerCase()}/${to.toLowerCase()}`, {
      signal: AbortSignal.timeout(10000),
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      return response.status(upstream.status).json({ error: data.message || "Exchange rate request failed." });
    }

    response.json({ amount, from, to, rate: data.rate, result: amount * data.rate, date: data.date });
  } catch (error) {
    console.error("Currency rate request failed:", error.message);
    response.status(502).json({ error: "Could not reach the exchange-rate API. Check your internet connection." });
  }
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Currency converter ready at http://127.0.0.1:${port}`);
});
