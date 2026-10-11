// WebRTC Dynamic Mesh Signaling & Connection Manager
import { attachRemoteStream, detachRemoteStream, detachAllStreams } from './audio';
import type { Socket } from 'socket.io-client';

const ICE_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

const activePeers = new Map<string, RTCPeerConnection>();
let socketInstance: Socket | null = null;
let currentLocalStream: MediaStream | null = null;

export function initWebRTC(
  socket: Socket,
  localStream: MediaStream | null
): () => void {
  socketInstance = socket;
  currentLocalStream = localStream;

  const onNearbyAdd = (peerId: string) => {
    if (activePeers.has(peerId)) return;
    const pc = createPeerConnection(peerId);

    if (socket.id && socket.id < peerId) {
      initiateOffer(pc, peerId);
    }
  };

  const onNearbyRemove = (peerId: string) => {
    closePeerConnection(peerId);
  };

  const onUserLeft = (peerId: string) => {
    closePeerConnection(peerId);
  };

  const onSignal = async ({ from, data }: { from: string; data: { sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit } }) => {
    const pc = activePeers.get(from) || createPeerConnection(from);
    try {
      if (data.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        if (data.sdp.type === 'offer') {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socketInstance?.emit('signal', {
            to: from,
            data: { sdp: pc.localDescription }
          });
        }
      } else if (data.candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    } catch (err) {
      console.warn('[WebRTC] Signaling error with peer:', from, err);
    }
  };

  socket.on('nearby-add', onNearbyAdd);
  socket.on('nearby-remove', onNearbyRemove);
  socket.on('user-left', onUserLeft);
  socket.on('signal', onSignal);

  return () => {
    socket.off('nearby-add', onNearbyAdd);
    socket.off('nearby-remove', onNearbyRemove);
    socket.off('user-left', onUserLeft);
    socket.off('signal', onSignal);
    closeAllPeerConnections();
  };
}

function createPeerConnection(peerId: string): RTCPeerConnection {
  const pc = new RTCPeerConnection(ICE_CONFIG);
  activePeers.set(peerId, pc);

  if (currentLocalStream) {
    currentLocalStream.getTracks().forEach((track) => {
      pc.addTrack(track, currentLocalStream!);
    });
  }

  pc.onicecandidate = (event) => {
    if (event.candidate && socketInstance) {
      socketInstance.emit('signal', {
        to: peerId,
        data: { candidate: event.candidate }
      });
    }
  };

  pc.ontrack = (event) => {
    if (event.streams && event.streams[0]) {
      attachRemoteStream(peerId, event.streams[0]);
    }
  };

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
      closePeerConnection(peerId);
    }
  };

  return pc;
}

async function initiateOffer(pc: RTCPeerConnection, peerId: string) {
  try {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketInstance?.emit('signal', {
      to: peerId,
      data: { sdp: pc.localDescription }
    });
  } catch (err) {
    console.warn('[WebRTC] Offer initiation error to', peerId, err);
  }
}

export function closePeerConnection(peerId: string): void {
  const pc = activePeers.get(peerId);
  if (!pc) return;
  pc.close();
  activePeers.delete(peerId);
  detachRemoteStream(peerId);
}

export function closeAllPeerConnections(): void {
  for (const [peerId, pc] of activePeers.entries()) {
    pc.close();
    detachRemoteStream(peerId);
  }
  activePeers.clear();
  detachAllStreams();
}
