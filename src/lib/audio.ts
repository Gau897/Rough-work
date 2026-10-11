// Spatial Audio Engine (Web Audio API)
const RADIUS = 100;
let audioCtx: AudioContext | null = null;
let localStream: MediaStream | null = null;
let isMicMuted = false;

interface PeerAudio {
  source: MediaStreamAudioSourceNode;
  gainNode: GainNode;
  panNode: StereoPannerNode;
  filterNode: BiquadFilterNode;
  analyser: AnalyserNode;
  buffer: Uint8Array;
  element: HTMLAudioElement;
}

const remotePeers = new Map<string, PeerAudio>();

export function initAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export async function setupLocalMicrophone(): Promise<MediaStream | null> {
  const ctx = initAudioContext();
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    });
    return localStream;
  } catch (err) {
    console.warn('Microphone permission blocked or unavailable, using silent stream:', err);
    try {
      const dest = ctx.createMediaStreamDestination();
      localStream = dest.stream;
      return localStream;
    } catch {
      return null;
    }
  }
}

export function toggleMicrophone(): boolean {
  if (!localStream) return false;
  isMicMuted = !isMicMuted;
  localStream.getAudioTracks().forEach(track => {
    track.enabled = !isMicMuted;
  });
  return !isMicMuted;
}

export function attachRemoteStream(peerId: string, stream: MediaStream): void {
  const ctx = initAudioContext();

  const el = new Audio();
  el.srcObject = stream;
  el.muted = true;
  el.play().catch(() => {});

  const source = ctx.createMediaStreamSource(stream);
  const gainNode = ctx.createGain();
  const panNode = ctx.createStereoPanner();
  const filterNode = ctx.createBiquadFilter();
  filterNode.type = 'lowpass';
  filterNode.frequency.value = 20000;

  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;

  // Signal chain: source -> filter -> gain -> pan -> destination
  source.connect(filterNode);
  filterNode.connect(gainNode);
  gainNode.connect(panNode);
  panNode.connect(ctx.destination);
  source.connect(analyser);

  remotePeers.set(peerId, {
    source,
    gainNode,
    panNode,
    filterNode,
    analyser,
    buffer: new Uint8Array(analyser.frequencyBinCount),
    element: el
  });
}

export function detachRemoteStream(peerId: string): void {
  const p = remotePeers.get(peerId);
  if (!p) return;
  try {
    p.gainNode.disconnect();
    p.panNode.disconnect();
    p.filterNode.disconnect();
    p.element.srcObject = null;
  } catch {}
  remotePeers.delete(peerId);
}

export function detachAllStreams(): void {
  for (const peerId of remotePeers.keys()) {
    detachRemoteStream(peerId);
  }
}

export interface FurnitureObject {
  id: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  blocksMovement: boolean;
  blocksSound: boolean;
  label?: string;
}

// Raycasting check: sound is blocked if passing through objects where blocksSound === true
function isOccludedByWalls(
  listener: { x: number; y: number },
  speaker: { x: number; y: number },
  furniture: FurnitureObject[]
): boolean {
  if (!furniture || !furniture.length) return false;
  for (let i = 1; i < 10; i++) {
    const rx = listener.x + ((speaker.x - listener.x) * i) / 10;
    const ry = listener.y + ((speaker.y - listener.y) * i) / 10;
    for (const obj of furniture) {
      if (obj.blocksSound) {
        if (rx >= obj.x && rx <= obj.x + obj.w && ry >= obj.y && ry <= obj.y + obj.h) {
          return true;
        }
      }
    }
  }
  return false;
}

export function updateSpatialAudio(
  listener: { x: number; y: number },
  speakerId: string,
  speakerPos: { x: number; y: number },
  furniture: FurnitureObject[] = []
): void {
  const peer = remotePeers.get(speakerId);
  if (!peer) return;

  const dx = speakerPos.x - listener.x;
  const dy = speakerPos.y - listener.y;
  const distance = Math.hypot(dx, dy);

  let targetGain = 0;
  let targetPan = 0;

  if (distance <= RADIUS) {
    const isOccluded = isOccludedByWalls(listener, speakerPos, furniture);
    targetGain = Math.max(0, 1 - distance / RADIUS);

    if (isOccluded) {
      targetGain *= 0.25;
      peer.filterNode.frequency.setTargetAtTime(800, audioCtx!.currentTime, 0.05);
    } else {
      peer.filterNode.frequency.setTargetAtTime(20000, audioCtx!.currentTime, 0.05);
    }

    targetPan = Math.max(-1, Math.min(1, dx / RADIUS));
  } else {
    targetGain = 0;
  }

  peer.gainNode.gain.setTargetAtTime(targetGain, audioCtx!.currentTime, 0.05);
  peer.panNode.pan.setTargetAtTime(targetPan, audioCtx!.currentTime, 0.05);
}

export function getVoiceLevel(peerId: string): number {
  const p = remotePeers.get(peerId);
  if (!p) return 0;
  p.analyser.getByteFrequencyData(p.buffer);
  let sum = 0;
  for (let i = 0; i < p.buffer.length; i++) {
    sum += p.buffer[i];
  }
  return sum / p.buffer.length;
}
