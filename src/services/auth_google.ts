import { API_BASE_URL } from "./payment";

interface GoogleAuthResponse {
  email: string;
  token: string;
}

export async function googleAuth(idToken: string): Promise<GoogleAuthResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/users/login/google`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
  });

  if (!response.ok) {
    throw new Error("google authentication failed");
  }

  return response.json();
}
