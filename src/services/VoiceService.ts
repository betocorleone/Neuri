export class VoiceService {
  private synthesis: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private _isMuted: boolean = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeVoice();
  }

  private initializeVoice() {
    // Wait for voices to be loaded
    const setVoice = () => {
      const voices = this.synthesis.getVoices();
      
      // Prefer Spanish voices
      const spanishVoice = voices.find(voice => 
        voice.lang.startsWith('es') && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => voice.lang.startsWith('es'));
      
      // Fallback to any female voice
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman')
      );
      
      this.voice = spanishVoice || femaleVoice || voices[0] || null;
    };

    if (this.synthesis.getVoices().length > 0) {
      setVoice();
    } else {
      this.synthesis.addEventListener('voiceschanged', setVoice);
    }
  }

  async speak(text: string): Promise<void> {
    if (this._isMuted) return;

    return new Promise((resolve) => {
      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings for a gentle, child-friendly tone
      utterance.rate = 0.8; // Slightly slower
      utterance.pitch = 1.2; // Slightly higher pitch
      utterance.volume = 0.8; // Gentle volume
      
      if (this.voice) {
        utterance.voice = this.voice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synthesis.speak(utterance);
    });
  }

  stop() {
    this.synthesis.cancel();
  }

  toggleMute() {
    this._isMuted = !this._isMuted;
    if (this._isMuted) {
      this.stop();
    }
    return this._isMuted;
  }

  get isMuted() {
    return this._isMuted;
  }
}