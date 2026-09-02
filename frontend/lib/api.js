const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://handart-backend.onrender.com");

export async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body != null) {
    config.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, config);
  } catch {
    throw new Error(`Unable to reach server at ${API_URL}. Is the backend running?`);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export { API_URL };