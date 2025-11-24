import { useEffect } from "react";

export default function Callback() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) return;

    fetch("/.netlify/functions/get-token", {
      method: "POST",
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        window.location.href = "/";
      })
      .catch(console.error);
  }, []);

  return <div>Authenticating...</div>;
}
