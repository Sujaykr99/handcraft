export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'https://handart-backend.onrender.com')

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type ApiBody = Record<string, any> | null | undefined

export const apiRequest = async <T = any>(
  endpoint: string,
  method: ApiMethod = 'GET',
  body: ApiBody = null,
  token?: string,
): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const config: RequestInit = {
    method,
    headers,
  }

  if (body != null) {
    config.body = JSON.stringify(body)
  }

  let response: Response

  try {
    response = await fetch(`${API_URL}${endpoint}`, config)
  } catch {
    throw new Error(`Unable to reach the server at ${API_URL}. Please make sure the backend is running.`)
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}
