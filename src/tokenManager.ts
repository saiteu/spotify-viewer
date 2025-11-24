export async function getValidToken() {
  let token = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  // API を試しに呼んで 401 なら refresh
  const isExpired = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.status === 401);

  if (!isExpired) return token;

  // expired → refresh token で更新
  const res = await fetch("/.netlify/functions/refresh-token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await res.json();

  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
    return data.access_token;
  }

  return null;
}
