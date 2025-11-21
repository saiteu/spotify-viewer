import { useEffect } from "react";
import { clientId, redirectUri } from "./auth";

export default function Callback() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) return;

    const verifier = localStorage.getItem("verifier")!;
    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    });

    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("access_token", data.access_token);
        window.location.href = "/";
      });
  }, []);

  return <div>Authenticating...</div>;
}
