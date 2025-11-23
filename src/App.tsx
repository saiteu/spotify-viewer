// src/App.tsx
import { useEffect, useState } from "react";
import { redirectToSpotifyAuth } from "./auth";

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [current, setCurrent] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // URL hash から access_token を取得
    const hash = window.location.hash;
    let accessToken =
      token || new URLSearchParams(hash.replace("#", "?")).get("access_token");

    if (accessToken) {
      setToken(accessToken);
      localStorage.setItem("access_token", accessToken);
      // ハッシュを消す
      window.history.replaceState({}, document.title, "/");
    }

    if (!accessToken) return;

    // Now Playing
    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setCurrent(data))
      .catch(console.error);

    // Recently Played
    fetch("https://api.spotify.com/v1/me/player/recently-played", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setHistory(data.items || []))
      .catch(console.error);
  }, [token]);

  if (!token)
    return <button onClick={redirectToSpotifyAuth}>Spotifyでログイン</button>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Now Playing</h2>
      {current?.item && (
        <div>
          <img
            src={current.item.album.images[0]?.url}
            width={150}
            alt="album"
          />
          <p>{current.item.name}</p>
          <p>{current.item.artists.map((a: any) => a.name).join(", ")}</p>
        </div>
      )}

      <h2>Recently Played</h2>
      {history.map((h, i) => (
        <div key={i}>
          <img src={h.track.album.images[0]?.url} width={64} alt="album" />
          <p>{h.track.name}</p>
        </div>
      ))}

      <button style={{ marginTop: 20 }} onClick={redirectToSpotifyAuth}>
        再ログイン / 更新
      </button>
    </div>
  );
}
