import { PexelsService } from './pexels';
import { InstagramService } from './instagram';
import fs from 'fs/promises';
import path from 'path';

export interface AutomationConfig {
  pexelsApiKey: string;
  instagramUsername: string;
  instagramPassword: string;
}

export class LuxuryVideoAutomation {
  private pexels: PexelsService;
  private instagram: InstagramService;
  private logFile: string;

  constructor(config: AutomationConfig) {
    this.pexels = new PexelsService(config.pexelsApiKey);
    this.instagram = new InstagramService(
      config.instagramUsername,
      config.instagramPassword
    );
    this.logFile = path.join(process.cwd(), 'automation.log');
  }

  private async log(message: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage.trim());

    try {
      await fs.appendFile(this.logFile, logMessage);
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  async run(): Promise<void> {
    try {
      await this.log('Starting luxury video automation...');

      // Step 1: Search for luxury videos
      await this.log('Searching for luxury lifestyle videos on Pexels...');
      const videos = await this.pexels.searchLuxuryVideos(1);

      if (!videos || videos.length === 0) {
        await this.log('No videos found. Exiting.');
        return;
      }

      const video = videos[0];
      await this.log(`Found video: ID ${video.id}, Duration: ${video.duration}s`);

      // Step 2: Get best quality video URL
      const videoUrl = this.pexels.getBestQualityVideo(video);
      await this.log(`Selected video URL: ${videoUrl}`);

      // Step 3: Download video
      await this.log('Downloading video...');
      const videoBuffer = await this.pexels.downloadVideo(videoUrl);
      await this.log(`Video downloaded: ${videoBuffer.length} bytes`);

      // Step 4: Generate caption
      const caption = this.instagram.generateCaption();
      await this.log(`Generated caption: "${caption}"`);

      // Step 5: Upload to Instagram
      await this.log('Uploading to Instagram...');
      const success = await this.instagram.uploadVideo(videoBuffer, caption);

      if (success) {
        await this.log('✅ Video successfully processed and uploaded!');
      } else {
        await this.log('❌ Failed to upload video to Instagram');
      }

      // Step 6: Save video metadata
      await this.saveVideoRecord(video.id, caption);

    } catch (error) {
      await this.log(`❌ Error in automation: ${error}`);
      throw error;
    }
  }

  private async saveVideoRecord(videoId: number, caption: string): Promise<void> {
    const recordFile = path.join(process.cwd(), 'posted-videos.json');

    try {
      let records: any[] = [];

      try {
        const data = await fs.readFile(recordFile, 'utf-8');
        records = JSON.parse(data);
      } catch {
        // File doesn't exist yet
      }

      records.push({
        videoId,
        caption,
        postedAt: new Date().toISOString(),
      });

      await fs.writeFile(recordFile, JSON.stringify(records, null, 2));
      await this.log('Video record saved');
    } catch (error) {
      await this.log(`Warning: Could not save video record: ${error}`);
    }
  }
}
