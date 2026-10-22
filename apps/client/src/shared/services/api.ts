const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export class StationApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'StationApiError';
  }
}

export async function stationFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new StationApiError(response.status, text);
  }

  return response.json() as Promise<T>;
}
