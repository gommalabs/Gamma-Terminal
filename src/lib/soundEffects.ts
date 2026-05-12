// Sound effects for Gamma Terminal notifications

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

// Play a short ping/notification sound
export function playPingSound(volume: number = 0.3): void {
  try {
    const ctx = getAudioContext();
    
    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Create a pleasant notification tone
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1); // A6
    
    // Short envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  } catch (error) {
    // Silently fail if audio is not available
    console.debug('Audio notification failed:', error);
  }
}

// Play a breaking news alert sound (more urgent)
export function playBreakingNewsSound(volume: number = 0.4): void {
  try {
    const ctx = getAudioContext();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    // Play a double-tone for breaking news
    const now = ctx.currentTime;
    
    // First tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(660, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(volume * 0.7, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    osc1.start(now);
    osc1.stop(now + 0.2);
    
    // Second tone (higher)
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(880, ctx.currentTime);
      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.3);
    }, 150);
  } catch (error) {
    console.debug('Breaking news sound failed:', error);
  }
}

// Initialize audio on user interaction (to work around autoplay policies)
export function initAudio(): void {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  } catch (error) {
    console.debug('Audio initialization failed:', error);
  }
}
