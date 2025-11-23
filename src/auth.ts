// src/auth.ts
export const clientId = "c853ef055d0c4307907f7d3174e6b195";
// ここは Dashboard に登録した URI と完全一致
export const redirectUri = "https://famous-custard-fc5264.netlify.app/";

export const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-recently-played",
].join(" ");

export function redirectToSpotifyAuth() {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "token", // Implicit Grant Flow
    redirect_uri: redirectUri,
    scope: scopes,
    show_dialog: "true", // 毎回承認画面を表示
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}
