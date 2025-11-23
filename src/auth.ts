// src/auth.ts
export const clientId = "c853ef055d0c4307907f7d3174e6b195";

// 中継ページ用 Redirect URI
export const redirectUri = "https://famous-custard-fc5264.netlify.app/callback";

export const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-recently-played",
].join(" ");

function base64encode(buffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(buffer);
  const charString = String.fromCharCode.apply(
    null,
    Array.from(uint8Array) as any
  );
  return btoa(charString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function generateCodeVerifier() {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return base64encode(array);
}

export async function generateCodeChallenge(verifier: string) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64encode(digest);
}

export async function redirectToSpotifyAuth() {
  const verifier = await generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri, // ここは encode しない
    code_challenge_method: "S256",
    code_challenge: challenge,
    scope: scopes,
    show_disalog: "true",
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}
