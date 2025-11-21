import { useEffect, useState } from "react";
import { redirectToSpotifyAuth } from "./auth";

export default function App() {
  const [current, setCurrent] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) return;

    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCurrent(data));

    fetch("https://api.spotify.com/v1/me/player/recently-played", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setHistory(data.items));
  }, [token]);

  if (!token)
    return <button onClick={redirectToSpotifyAuth}>Spotifyでログイン</button>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Now Playing</h2>
      {current?.item && (
        <div>
          <img src={current.item.album.images[0].url} width={150} alt="album" />
          <p>{current.item.name}</p>
          <p>{current.item.artists.map((a: any) => a.name).join(", ")}</p>
        </div>
      )}

      <h2>Recently Played</h2>
      {history.map((h, i) => (
        <div key={i}>
          <img src={h.track.album.images[0].url} width={64} />
          <p>{h.track.name}</p>
        </div>
      ))}
    </div>
  );
}
