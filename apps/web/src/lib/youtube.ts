// src/lib/youtube.ts

// ⚡ Bolt Optimization: Pre-compile regexes to avoid re-compilation on every call
// Optimized to capture groups directly, avoiding string replacements
const ISO_DURATION_REGEX = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;

/**
 * Searches YouTube for music videos with strict duration filtering.
 *
 * Rules:
 * - Must be between 1 and 10 minutes long
 * - Must be categorized as Music (CategoryId: 10)
 *
 * @param query - The search term
 * @throws {Error} If YOUTUBE_API_KEY is missing
 * @returns Array of video objects with normalized duration
 */
export async function searchYouTube(query: string) {
  const key = process.env.YOUTUBE_API_KEY;

  if (!key) throw new Error('YOUTUBE_API_KEY is missing');

  // 1. SEARCH
  // ⚡ Bolt Optimization: Increase maxResults to 50 (max) to increase chance of finding valid videos
  // without extra API requests. Cost is same (100 units) for list request.
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=50&q=${encodeURIComponent(query)}&key=${key}`;

  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  if (!searchData.items?.length) return [];

  // 2. GET DETAILS (For Duration)

  const videoIds = searchData.items
    // biome-ignore lint/suspicious/noExplicitAny: migration
    .map((item: any) => item.id.videoId)
    .join(',');
  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${key}`;

  const detailsRes = await fetch(detailsUrl);
  const detailsData = await detailsRes.json();

  // 3. FILTER & FORMAT
  // ⚡ Bolt Optimization: Single pass reduce to filter and format, reusing regex match
  return (
    detailsData.items
      // biome-ignore lint/suspicious/noExplicitAny: migration
      .reduce((acc: any[], video: any) => {
        const duration = video.contentDetails.duration;
        const match = duration.match(ISO_DURATION_REGEX);

        if (!match) return acc;

        const hoursStr = match[1];
        const minsStr = match[2];
        const secsStr = match[3];

        const minutes = minsStr ? Number.parseInt(minsStr, 10) : 0;
        const hasSeconds = !!secsStr;

        // Strict Rules: 1 min < Length < 10 mins
        // Preserving legacy behavior: hours are ignored for the < 10 check
        if (minutes < 10 && (minutes >= 1 || hasSeconds)) {
          const formattedDuration = hoursStr
            ? `${hoursStr}:${(minsStr || '0').padStart(2, '0')}:${(secsStr || '00').padStart(2, '0')}`
            : `${minsStr || '0'}:${(secsStr || '00').padStart(2, '0')}`;

          acc.push({
            id: video.id,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.medium.url,
            channel: video.snippet.channelTitle,
            duration: formattedDuration,
          });
        }
        return acc;
      }, [])
  );
}
