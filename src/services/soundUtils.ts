// Sound utility functions for the app
export class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;

  private constructor() {
    // Initialize audio context when first used
    this.initAudioContext();
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.log('Audio not supported in this browser');
    }
  }

  // Generate a gentle success sound
  playSuccessSound(): void {
    if (!this.audioContext) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    let time = this.audioContext.currentTime;

    notes.forEach((frequency) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);

      osc.frequency.setValueAtTime(frequency, time);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.1, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

      osc.start(time);
      osc.stop(time + 0.3);

      time += 0.15;
    });
  }

  // Generate a gentle button click sound
  playClickSound(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // Generate a gentle notification sound
  playNotificationSound(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(880, this.audioContext.currentTime + 0.1);
    oscillator.type = 'triangle';

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }
}

export const soundManager = SoundManager.getInstance();