# Auth0 login demo

This is a small React single-page app demonstrating Auth0 sign-up, login, logout, and displaying the signed-in user's profile. It does not store application records or call a protected API.

## Configure Auth0

1. Sign in at https://auth0.com/ and open the Auth0 Dashboard.
2. Go to **Applications → Applications → Create Application**.
3. Give it a name and choose **Single Page Web Application**.
4. Open the new application's **Settings** and set each of these to `http://localhost:5173`:
   - Allowed Callback URLs
   - Allowed Logout URLs
   - Allowed Web Origins
5. Save the settings. Copy the application's **Domain** and **Client ID**.
6. Open `src/main.jsx` and replace `YOUR_AUTH0_DOMAIN` and `YOUR_AUTH0_CLIENT_ID` with the values from the application settings. Use the domain only (no `https://`).

## Run

From this folder, run:

```powershell
npm install
npm run dev
```

Open the local URL Vite prints, normally `http://localhost:5173`. If that port is already taken, Vite may choose a different one; add the exact new URL to all three Auth0 URL settings before signing in.

The client ID and domain identify the Auth0 application and are intended for browser use. Do not add a client secret to this React app. See the [Auth0 React quickstart](https://auth0.com/docs/quickstart/spa/react) for the official SDK setup.
