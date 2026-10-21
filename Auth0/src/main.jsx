import React from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.jsx";

// Paste the Auth0 application values here.
const domain = "dev-8ef5bsmqlj1c6h7q.us.auth0.com"; // Example: dev-abc123.us.auth0.com
const clientId = "2EJCBya9R5k6tEe5GyaFDUOmdiEuaBJb";
const root = createRoot(document.getElementById("root"));

if (domain.startsWith("YOUR_") || clientId.startsWith("YOUR_")) {
  root.render(
    <main>
      <h1>Auth0 setup needed</h1>
      <p>Enter your Auth0 Domain and Client ID in src/main.jsx.</p>
    </main>,
  );
} else {
  root.render(
    <React.StrictMode>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{ redirect_uri: window.location.origin }}
      >
        <App />
      </Auth0Provider>
    </React.StrictMode>,
  );
}
