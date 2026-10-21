# Third-party API example

This small Node.js server calls the public JSONPlaceholder posts API and exposes local endpoints that can be exercised in Postman. It needs no API key. It uses Node's built-in `fetch` and Express.

## Run the local API

From this folder, run:

```powershell
npm install
npm run dev
```

The server listens at `http://127.0.0.1:3002`.

## Test in Postman

1. In Postman, choose **Import**.
2. Select `postman/ThirdPartyAPI.postman_collection.json` from this folder.
3. Keep the Node server running, open the imported collection, and click **Run**.

The collection includes a health check, list posts, read one post, and create a demo post. Its test scripts check the HTTP status and response fields.

## Local endpoints

- `GET /api/health`
- `GET /api/posts?limit=5`
- `GET /api/posts/1`
- `POST /api/posts` with JSON such as `{ "title": "Hello", "body": "API test", "userId": 1 }`

This example uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/), a fake API for testing and learning. It returns a successful response for POST, but the post is not permanently saved upstream. The local server binds to your computer only.
