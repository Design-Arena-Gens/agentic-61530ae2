import axios from 'axios';

export interface PexelsVideo {
  id: number;
  url: string;
  duration: number;
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
}

export class PexelsService {
  private apiKey: string;
  private baseUrl = 'https://api.pexels.com/videos';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchLuxuryVideos(perPage: number = 1): Promise<PexelsVideo[]> {
    const queries = [
      'luxury lifestyle',
      'luxury car',
      'luxury yacht',
      'luxury mansion',
      'luxury hotel',
      'luxury fashion',
      'luxury travel',
      'penthouse',
      'private jet',
      'champagne luxury'
    ];

    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        headers: {
          Authorization: this.apiKey,
        },
        params: {
          query: randomQuery,
          per_page: perPage,
          orientation: 'portrait',
          size: 'medium',
        },
      });

      return response.data.videos;
    } catch (error) {
      console.error('Error fetching videos from Pexels:', error);
      throw error;
    }
  }

  async downloadVideo(videoUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(videoUrl, {
        responseType: 'arraybuffer',
      });

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error downloading video:', error);
      throw error;
    }
  }

  getBestQualityVideo(video: PexelsVideo): string {
    // Filter for HD or SD quality, prefer portrait orientation
    const videoFiles = video.video_files
      .filter(file => file.width <= 1080) // Instagram max width
      .sort((a, b) => {
        // Prefer portrait orientation (height > width)
        const aIsPortrait = a.height > a.width ? 1 : 0;
        const bIsPortrait = b.height > b.width ? 1 : 0;

        if (aIsPortrait !== bIsPortrait) {
          return bIsPortrait - aIsPortrait;
        }

        // Then prefer higher resolution
        return (b.width * b.height) - (a.width * a.height);
      });

    return videoFiles[0]?.link || video.video_files[0].link;
  }
}
