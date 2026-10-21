# MongoDB CRUD app

A small local app with Create, Read, Update, and Delete operations. It uses the official MongoDB Node.js driver, an Express server, and a plain HTML page. The browser never receives the database connection string.

## Setup

1. Install Node.js.
2. Create a MongoDB Atlas cluster (or use a local MongoDB server).
3. In Atlas, create a database user and allow your current IP address under Network Access.
4. Open `server.js` and replace `YOUR_MONGODB_ATLAS_URI` with your MongoDB connection string. Replace the username, password, and cluster host with your own values. URL-encode special characters in the password.
5. Optionally change `MONGODB_DB`; the app creates the database and `records` collection when the first record is saved.
6. From this folder, run:

   ```powershell
   npm install
   npm run dev
   ```

7. Open `http://localhost:3000`.

The documents are stored in the configured database under the `records` collection. Keep `server.js` private if it contains your real URI, and never put the URI in browser code or commit it to a public repository. This demo binds only to your own computer and has no user authentication; do not expose it to the internet as-is.
