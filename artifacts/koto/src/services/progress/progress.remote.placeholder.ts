// TODO: Replace with real Cloudflare D1 API calls when backend is implemented.
// This file is a placeholder for the remote progress service.

export async function syncProgressToRemote(): Promise<void> {
  // TODO: POST /api/progress/sync with local progress data
  console.warn('[progress.remote] Remote sync not yet implemented.');
}

export async function fetchProgressFromRemote(): Promise<null> {
  // TODO: GET /api/progress and merge with local
  console.warn('[progress.remote] Remote fetch not yet implemented.');
  return null;
}
