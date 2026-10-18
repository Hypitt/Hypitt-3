// Web Audio Player & WAV Stem Generator for published audio posts
class SynthesizedAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentPostId: string | null = null;
  private intervalId: any = null;
  private onStateChange: ((postId: string | null, isPlaying: boolean) => void) | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Subscribe to playback changes
  subscribe(callback: (postId: string | null, isPlaying: boolean) => void) {
    this.onStateChange = callback;
  }

  // Play an interactive rhythmic musical loop representing the published track
  playTrack(postId: string) {
    if (this.currentPostId === postId && this.isPlaying) {
      this.stop();
      return;
    }

    this.stop();
    const ctx = this.getContext();
    if (!ctx) return;

    this.currentPostId = postId;
    this.isPlaying = true;
    if (this.onStateChange) this.onStateChange(postId, true);

    const notes = [220, 261.63, 293.66, 329.63, 392.0, 440]; // A minor pentatonic
    let step = 0;

    const playStep = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Bass note
      if (step % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(step % 8 === 0 ? 110 : 98, now);
        bassGain.gain.setValueAtTime(0.3, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.35);
      }

      // Melody note
      const noteFreq = notes[step % notes.length];
      const melOsc = this.ctx.createOscillator();
      const melGain = this.ctx.createGain();
      melOsc.type = 'sine';
      melOsc.frequency.setValueAtTime(noteFreq, now);
      melGain.gain.setValueAtTime(0.15, now);
      melGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      melOsc.connect(melGain);
      melGain.connect(this.ctx.destination);
      melOsc.start(now);
      melOsc.stop(now + 0.22);

      // Soft Hi-Hat on offbeats
      if (step % 2 === 1) {
        const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.04, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 6000;
        const hatGain = this.ctx.createGain();
        hatGain.gain.setValueAtTime(0.08, now);
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        whiteNoise.connect(filter);
        filter.connect(hatGain);
        hatGain.connect(this.ctx.destination);
        whiteNoise.start(now);
      }

      step = (step + 1) % 16;
    };

    // 120 BPM 16th note timing (~125ms per step)
    playStep();
    this.intervalId = setInterval(playStep, 130);
  }

  stop() {
    this.isPlaying = false;
    this.currentPostId = null;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.onStateChange) this.onStateChange(null, false);
  }

  getPlayingPostId(): string | null {
    return this.isPlaying ? this.currentPostId : null;
  }

  // Trigger actual file download to local device (.wav audio file)
  downloadAudioStem(title: string, authorHandle: string = '@creator') {
    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const safeAuthor = authorHandle.replace('@', '').toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `${safeAuthor}_${safeTitle}_stem.wav`;

    // Generate a valid 44.1kHz 16-bit PCM WAV file buffer (3 seconds sample)
    const sampleRate = 44100;
    const duration = 2.5; // 2.5 seconds clip
    const numChannels = 1;
    const numSamples = sampleRate * duration;
    const bytesPerSample = 2;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = numSamples * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // Write WAV header (RIFF)
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // BitsPerSample
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    // Synthesize pleasant musical tone into sample buffer
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const freq = 440 * Math.pow(2, ((i % 8820) / 8820) * 0.5); // melodic slide
      const sample = Math.sin(2 * Math.PI * freq * t) * 0.4 * Math.exp(-t * 0.5);
      const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
      view.setInt16(44 + i * 2, intSample, true);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}

export const audioPlayer = new SynthesizedAudioPlayer();
