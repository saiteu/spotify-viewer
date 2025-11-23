// src/App.tsx
import { useEffect, useState } from "react";
import { redirectToSpotifyAuth } from "./auth";
import { getValidAccessToken } from "./tokenManager";

export default function App() {
  const [current, setCurrent] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );

  useEffect(() => {
    // tokenを更新してからAPI呼び出し
    async function load() {
      let validToken = await getValidAccessToken();

      if (!validToken) return;

      setToken(validToken);

      fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${validToken}` },
      })
        .then((res) => res.json())
        .then((data) => setCurrent(data))
        .catch(console.error);

      fetch("https://api.spotify.com/v1/me/player/recently-played", {
        headers: { Authorization: `Bearer ${validToken}` },
      })
        .then((res) => res.json())
        .then((data) => setHistory(data.items || []))
        .catch(console.error);
    }

    load();
  }, []);

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
    </div>
  );
}
