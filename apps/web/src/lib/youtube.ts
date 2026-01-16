// src/lib/youtube.ts

export interface FormattedVideo {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
}

/**
 * Searches YouTube for music videos with strict duration filtering.
 *
 * Rules:
 * - Must be between 1 and 10 minutes long
 * - Must be categorized as Music (CategoryId: 10)
 *
 * @param query - The search term
 * @returns Array of video objects with normalized duration
 */

export async function searchYouTube(_query: string): Promise<FormattedVideo[]> {
  // YOUTUBE_API_KEY removed as per request. Returning empty array.
  return [];
}
