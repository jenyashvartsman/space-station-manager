import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { stationFetch, StationApiError } from './api';

describe('stationFetch', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns parsed JSON on a 2xx response', async () => {
    const mockData = { id: 1, name: 'Kepler Station' };
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), { status: 200 }),
    );

    const result = await stationFetch<typeof mockData>('/api/station');
    expect(result).toEqual(mockData);
  });

  it('throws StationApiError on a non-2xx response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('Not Found', { status: 404 }),
    );

    await expect(stationFetch('/api/missing')).rejects.toThrow(StationApiError);
  });

  it('includes the HTTP status code in the thrown error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('Internal Server Error', { status: 500 }),
    );

    const error = await stationFetch('/api/broken').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(StationApiError);
    expect((error as StationApiError).status).toBe(500);
  });

  it('throws StationApiError on a 4xx response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('Unauthorized', { status: 401 }),
    );

    await expect(stationFetch('/api/secure')).rejects.toThrow(StationApiError);
  });
});
