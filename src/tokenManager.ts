// src/tokenManager.ts
import { clientId } from "./auth";

export async function getValidAccessToken() {
  let access = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");

  // そもそもトークンがない
  if (!access) return null;

  // refresh_tokenなし → 更新不可 → そのまま返す
  if (!refresh) return access;

  // アクセストークンが有効かテスト
  const test = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${access}` },
  });

  // 有効ならそのまま
  if (test.status !== 401) return access;

  console.log("🔄 Token expired. Refreshing...");

  // refresh_token で更新
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refresh,
    client_id: clientId,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();

  localStorage.setItem("access_token", data.access_token);

  return data.access_token;
}
