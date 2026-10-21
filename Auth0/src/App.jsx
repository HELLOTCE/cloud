import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const { isLoading, isAuthenticated, user, error, loginWithRedirect, logout } = useAuth0();

  if (isLoading) return <main><p>Loading…</p></main>;

  if (error) {
    return <main><h1>Auth0 error</h1><p>{error.message}</p></main>;
  }

  if (!isAuthenticated) {
    return (
      <main>
        <h1>Auth0 Login Demo</h1>
        <p>Sign in or create an account using Auth0 Universal Login.</p>
        <button onClick={() => loginWithRedirect()}>Log in</button>{" "}
        <button onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: "signup" } })}>
          Sign up
        </button>
      </main>
    );
  }

  return (
    <main>
      <h1>You are signed in</h1>
      {user.picture && <p><img src={user.picture} alt="Profile" width="80" /></p>}
      <p><strong>Name:</strong> {user.name || "Not provided"}</p>
      <p><strong>Email:</strong> {user.email || "Not provided"}</p>
      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Log out
      </button>
    </main>
  );
}
