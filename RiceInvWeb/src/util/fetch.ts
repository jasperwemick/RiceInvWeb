export default async function apiFetch<T>(url: string, config?: RequestInit): Promise<T> {
  const response = await fetch(url, config);
  if (!response.ok) {
    throw new Error(`Fetch failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}
