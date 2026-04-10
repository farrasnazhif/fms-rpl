import Cookies from "universal-cookie";

const TOKEN_KEY = "@next-starter/token";

export function getToken(): string | undefined {
  const cookies = new Cookies();
  const token = cookies.get(TOKEN_KEY);
  return typeof token === "string" ? token : undefined;
}

export function setToken(token: string) {
  const cookies = new Cookies();

  cookies.set(TOKEN_KEY, token, {
    path: "/",
    sameSite: "lax",
  });
}

export function removeToken() {
  const cookies = new Cookies();
  cookies.remove(TOKEN_KEY, { path: "/" });
}
