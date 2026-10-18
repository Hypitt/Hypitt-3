import { Room, RoomEvent, VideoPresets, Track } from 'livekit-client';

const livekitUrl = import.meta.env.VITE_LIVEKIT_URL || '';

export const isLiveKitConfigured = Boolean(livekitUrl);

export interface LiveRoomConfig {
  roomName: string;
  participantName: string;
  isHost?: boolean;
  videoEnabled?: boolean;
  audioEnabled?: boolean;
}

class LiveKitService {
  private room: Room | null = null;
  private isConnected = false;

  public async getLiveToken(roomName: string, participantName: string): Promise<string | null> {
    try {
      const res = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, participantName }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.token || null;
    } catch (err) {
      console.warn('LiveKit token request error, using fallback stream simulation:', err);
      return null;
    }
  }

  public async connectToRoom(config: LiveRoomConfig, onTrackSubscribed?: (track: any, participant: any) => void) {
    if (!livekitUrl) {
      console.info('LiveKit URL not set in environment, running simulated live media mode');
      return { simulated: true };
    }

    try {
      const token = await this.getLiveToken(config.roomName, config.participantName);
      if (!token) {
        return { simulated: true };
      }

      this.room = new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: VideoPresets.h720.resolution,
        },
      });

      if (onTrackSubscribed) {
        this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          onTrackSubscribed(track, participant);
        });
      }

      await this.room.connect(livekitUrl, token);
      this.isConnected = true;

      if (config.videoEnabled) {
        await this.room.localParticipant.setCameraEnabled(true);
      }
      if (config.audioEnabled) {
        await this.room.localParticipant.setMicrophoneEnabled(true);
      }

      return { simulated: false, room: this.room };
    } catch (error) {
      console.warn('Failed to connect to LiveKit Cloud room, falling back to simulated room:', error);
      return { simulated: true, error };
    }
  }

  public async disconnect() {
    if (this.room) {
      await this.room.disconnect();
      this.room = null;
      this.isConnected = false;
    }
  }

  public getRoomInstance() {
    return this.room;
  }
}

export const livekitService = new LiveKitService();
