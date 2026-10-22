# Currency converter

A simple HTML currency converter served by a local Express server. The server requests the latest available reference rate from the Frankfurter API. No API key is required.

## Run

From this folder, install dependencies once and start the server:

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:3002` in your browser. Choose an amount and currencies, then select **Convert**.

Rates are reference rates updated daily and may differ from a bank or payment provider's rate. The browser page is plain HTML and uses the browser's default styling.

## Local endpoint

- `GET /api/convert?amount=100&from=INR&to=USD`
- `GET /api/health`

The conversion endpoint gets a rate from `https://api.frankfurter.dev/v2/rate/{base}/{quote}` and multiplies it by the requested amount.
