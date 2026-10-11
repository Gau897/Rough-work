import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import {
  Mic,
  MicOff,
  LogOut,
  Volume2,
  Lock,
  Copy,
  Check,
  Home,
  Users,
  Radio,
  PhoneCall,
  PhoneOff
} from 'lucide-react';
import {
  setupLocalMicrophone,
  toggleMicrophone,
  updateSpatialAudio,
  initAudioContext,
  FurnitureObject
} from '../lib/audio';
import { initWebRTC } from '../lib/webrtc';

interface RoomUser {
  socketId: string;
  userId: string;
  name: string;
  roomCode: string;
  avatarIcon: string;
  color: string;
  x: number;
  y: number;
  isLeader: boolean;
  privacyMode: 'open' | 'private' | 'dnd';
  bubbleId: string | null;
}

interface ActiveMeeting {
  active: boolean;
  hostId: string;
  hostName: string;
  topic: string;
  type: 'all' | 'selected';
  participants?: string[];
}

const SPEED = 5;
const RADIUS = 100;

export const OfficePage: React.FC = () => {
  const { code } = useParams<{ code?: string }>();
  const navigate = useNavigate();

  // User Profile
  const [profile] = useState(() => {
    const saved = localStorage.getItem('proxispeak_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    const rnd = Math.random().toString(36).substring(2, 7).toUpperCase();
    return {
      userId: `USR-${rnd}`,
      name: 'Alex Morgan',
      avatarIcon: '👨‍💻',
      color: '#2F80ED'
    };
  });

  const roomCode = (code || localStorage.getItem('proxispeak_last_room') || 'OFFICE1').toUpperCase();

  // Room State
  const [roomName, setRoomName] = useState(`Office ${roomCode}`);
  const [isLeader, setIsLeader] = useState(false);
  const [furniture, setFurniture] = useState<FurnitureObject[]>([]);
  const [privacyMode, setPrivacyMode] = useState<'open' | 'private' | 'dnd'>('open');
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [nearbyCount, setNearbyCount] = useState(0);
  const [activeUsersCount, setActiveUsersCount] = useState(1);

  // Quick Meeting State
  const [meeting, setMeeting] = useState<ActiveMeeting | null>(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingTopic, setMeetingTopic] = useState('All-Hands Team Sync');

  // Knocking
  const [knockPending, setKnockPending] = useState<{ fromSocketId: string; fromName: string; bubbleId: string } | null>(null);
  const [nearbyPrivateUser, setNearbyPrivateUser] = useState<RoomUser | null>(null);

  // Canvas & Networking Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const myPosRef = useRef({ x: 350, y: 350 });
  const usersRef = useRef<Map<string, RoomUser>>(new Map());
  const keysRef = useRef<{ [k: string]: boolean }>({});
  const animationFrameRef = useRef<number | null>(null);

  // Connect socket and WebRTC
  useEffect(() => {
    localStorage.setItem('proxispeak_last_room', roomCode);

    // Save to history list
    const savedHist = localStorage.getItem('proxispeak_room_history');
    let hist: string[] = savedHist ? JSON.parse(savedHist) : [];
    hist = [roomCode, ...hist.filter(c => c !== roomCode)].slice(0, 8);
    localStorage.setItem('proxispeak_room_history', JSON.stringify(hist));

    const socket = io('/', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    let cleanupWebRTC: (() => void) | null = null;

    setupLocalMicrophone().then((stream) => {
      cleanupWebRTC = initWebRTC(socket, stream);
    });

    socket.on('connect', () => {
      socket.emit('join-room', {
        roomCode,
        userId: profile.userId,
        name: profile.name,
        avatarIcon: profile.avatarIcon,
        color: profile.color,
      });
    });

    socket.on('room-joined', (data: { user: RoomUser; room: any; users: RoomUser[]; isLeader: boolean }) => {
      myPosRef.current = { x: data.user.x, y: data.user.y };
      setIsLeader(data.isLeader);
      if (data.room.name) setRoomName(data.room.name);
      if (data.room.furniture) setFurniture(data.room.furniture);
      if (data.room.meeting) setMeeting(data.room.meeting);

      const map = new Map<string, RoomUser>();
      data.users.forEach(u => {
        if (u.socketId !== socket.id) map.set(u.socketId, u);
      });
      usersRef.current = map;
      setActiveUsersCount(map.size + 1);
    });

    socket.on('user-entered', (newUser: RoomUser) => {
      if (newUser.socketId !== socket.id) {
        usersRef.current.set(newUser.socketId, newUser);
        setActiveUsersCount(usersRef.current.size + 1);
      }
    });

    socket.on('user-moved', ({ socketId, x, y }: { socketId: string; x: number; y: number }) => {
      const u = usersRef.current.get(socketId);
      if (u) {
        u.x = x;
        u.y = y;
      }
    });

    socket.on('user-privacy-changed', ({ socketId, privacyMode: mode, bubbleId }: any) => {
      const u = usersRef.current.get(socketId);
      if (u) {
        u.privacyMode = mode;
        u.bubbleId = bubbleId;
      }
    });

    socket.on('user-left', (socketId: string) => {
      usersRef.current.delete(socketId);
      setActiveUsersCount(usersRef.current.size + 1);
    });

    socket.on('room-layout-updated', (newFurniture: FurnitureObject[]) => {
      setFurniture(newFurniture);
    });

    socket.on('meeting-started', (meetingData: ActiveMeeting) => {
      setMeeting(meetingData);
    });

    socket.on('meeting-ended', () => {
      setMeeting(null);
    });

    socket.on('bubble-knock-received', (knockData: any) => {
      setKnockPending(knockData);
    });

    socket.on('knock-accepted', ({ bubbleId }: { bubbleId: string }) => {
      setPrivacyMode('private');
      socket.emit('set-privacy-mode', { mode: 'private', bubbleId });
    });

    return () => {
      if (cleanupWebRTC) cleanupWebRTC();
      socket.emit('leave-room');
      socket.disconnect();
    };
  }, [roomCode, profile.userId]);

  // Key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      keysRef.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Collision Logic
  const checkCollision = useCallback((nx: number, ny: number) => {
    for (const obj of furniture) {
      if (obj.blocksMovement) {
        if (nx >= obj.x - 18 && nx <= obj.x + obj.w + 18 && ny >= obj.y - 18 && ny <= obj.y + obj.h + 18) {
          return true;
        }
      }
    }
    return false;
  }, [furniture]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastSent = 0;

    const loop = (timestamp: number) => {
      // 1. Process movement
      let dx = 0;
      let dy = 0;
      const k = keysRef.current;

      if (k['arrowup'] || k['w']) dy -= SPEED;
      if (k['arrowdown'] || k['s']) dy += SPEED;
      if (k['arrowleft'] || k['a']) dx -= SPEED;
      if (k['arrowright'] || k['d']) dx += SPEED;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      let newX = myPosRef.current.x + dx;
      let newY = myPosRef.current.y + dy;

      newX = Math.max(30, Math.min(canvas.width - 30, newX));
      newY = Math.max(30, Math.min(canvas.height - 30, newY));

      if ((dx !== 0 || dy !== 0) && !checkCollision(newX, newY)) {
        myPosRef.current.x = newX;
        myPosRef.current.y = newY;

        if (timestamp - lastSent > 30 && socketRef.current?.connected) {
          socketRef.current.emit('move', { x: Math.round(newX), y: Math.round(newY) });
          lastSent = timestamp;
        }
      }

      // 2. Proximity & Spatial Audio
      let earshotUsers = 0;
      let nearbyPrivate: RoomUser | null = null;

      usersRef.current.forEach((u, sId) => {
        const dist = Math.hypot(u.x - myPosRef.current.x, u.y - myPosRef.current.y);
        updateSpatialAudio(myPosRef.current, sId, { x: u.x, y: u.y }, furniture);

        if (dist <= RADIUS || meeting?.active) {
          earshotUsers++;
          if (u.privacyMode === 'private' && privacyMode !== 'private' && !meeting?.active) {
            nearbyPrivate = u;
          }
        }
      });

      setNearbyCount(earshotUsers);
      setNearbyPrivateUser(nearbyPrivate);

      // 3. Realistic Architectural Canvas Rendering
      // Floor Background: Warm Luxury Hardwood Floor
      ctx.fillStyle = '#E8DFD8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Parquet Wood Planks Grid
      ctx.strokeStyle = '#D9CEBF';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Perimeter Baseboard
      ctx.strokeStyle = '#B3A899';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

      // Render Furniture with Soft Drop Shadows
      furniture.forEach(item => {
        ctx.save();

        if (item.type === 'meeting_zone') {
          // Acoustic Glass Conference Suite
          ctx.shadowColor = 'rgba(47, 128, 237, 0.15)';
          ctx.shadowBlur = 14;
          ctx.fillStyle = 'rgba(235, 245, 255, 0.75)';
          ctx.fillRect(item.x, item.y, item.w, item.h);

          ctx.strokeStyle = '#3B82F6';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([8, 6]);
          ctx.strokeRect(item.x, item.y, item.w, item.h);
          ctx.setLineDash([]);

          ctx.fillStyle = '#1E3A8A';
          ctx.font = 'bold 12px Inter, sans-serif';
          ctx.fillText(`🏛️ ${item.label || 'Executive Boardroom'}`, item.x + 14, item.y + 26);
        } else if (item.type === 'wall') {
          // Architectural Drywall with Depth (Supports both Vertical & Horizontal)
          ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetY = 4;

          ctx.fillStyle = '#475569';
          ctx.fillRect(item.x, item.y, item.w, item.h);

          // Crown highlight
          ctx.fillStyle = '#64748B';
          if (item.w > item.h) {
            ctx.fillRect(item.x, item.y, item.w, Math.max(3, item.h * 0.4));
          } else {
            ctx.fillRect(item.x, item.y, Math.max(3, item.w * 0.4), item.h);
          }

          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.strokeRect(item.x, item.y, item.w, item.h);
        } else if (item.type === 'door') {
          // Glass Pivot Door
          ctx.fillStyle = 'rgba(224, 242, 254, 0.85)';
          ctx.fillRect(item.x, item.y, item.w, item.h);
          ctx.strokeStyle = '#0284C7';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(item.x, item.y, item.w, item.h);

          ctx.fillStyle = '#0284C7';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText('DOOR', item.x + 2, item.y + item.h / 2 + 3);
        } else if (item.type === 'table') {
          // Premium Scandinavian Desk
          ctx.shadowColor = 'rgba(0, 0, 0, 0.14)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetY = 5;

          ctx.fillStyle = '#C89D7C';
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(item.x, item.y, item.w, item.h, 6) : ctx.rect(item.x, item.y, item.w, item.h);
          ctx.fill();

          ctx.strokeStyle = '#A87A57';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Laptop accessory
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;
          ctx.fillStyle = '#334155';
          ctx.fillRect(item.x + item.w / 2 - 16, item.y + item.h / 2 - 10, 32, 20);
          ctx.fillStyle = '#E2E8F0';
          ctx.fillRect(item.x + item.w / 2 - 14, item.y + item.h / 2 - 8, 28, 16);
        } else if (item.type === 'chair') {
          // Ergonomic Mesh Swivel Chair
          ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
          ctx.shadowBlur = 6;
          ctx.shadowOffsetY = 3;

          const cx = item.x + item.w / 2;
          const cy = item.y + item.h / 2;

          ctx.fillStyle = '#3B82F6';
          ctx.beginPath();
          ctx.arc(cx, cy, 14, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#1D4ED8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(cx, cy, 15, Math.PI * 0.8, Math.PI * 2.2);
          ctx.stroke();
        } else if (item.type === 'plant') {
          // Potted Fiddle Leaf Fig
          ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetY = 4;

          const cx = item.x + item.w / 2;
          const cy = item.y + item.h / 2;

          ctx.fillStyle = '#F8FAFC';
          ctx.beginPath();
          ctx.arc(cx, cy, 16, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#22C55E';
          ctx.beginPath();
          ctx.arc(cx - 5, cy - 4, 8, 0, Math.PI * 2);
          ctx.arc(cx + 6, cy - 3, 9, 0, Math.PI * 2);
          ctx.arc(cx, cy + 6, 8, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'coffee') {
          // Espresso Bar Station
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetY = 4;

          ctx.fillStyle = '#D97706';
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(item.x, item.y, item.w, item.h, 6) : ctx.rect(item.x, item.y, item.w, item.h);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = '20px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('☕', item.x + item.w / 2, item.y + item.h / 2);
        } else if (item.type === 'whiteboard') {
          // Whiteboard
          ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
          ctx.shadowBlur = 6;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(item.x, item.y, item.w, item.h);
          ctx.strokeStyle = '#0284C7';
          ctx.lineWidth = 2;
          ctx.strokeRect(item.x, item.y, item.w, item.h);

          ctx.fillStyle = '#0284C7';
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.fillText('📋 Whiteboard', item.x + 8, item.y + 14);
        }

        ctx.restore();
      });

      // Spatial Sound Sphere
      ctx.save();
      const auraGrad = ctx.createRadialGradient(
        myPosRef.current.x, myPosRef.current.y, 10,
        myPosRef.current.x, myPosRef.current.y, RADIUS
      );
      if (meeting?.active) {
        auraGrad.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
        auraGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
      } else if (privacyMode === 'dnd') {
        auraGrad.addColorStop(0, 'rgba(239, 68, 68, 0.18)');
        auraGrad.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      } else {
        auraGrad.addColorStop(0, 'rgba(47, 128, 237, 0.20)');
        auraGrad.addColorStop(1, 'rgba(47, 128, 237, 0.0)');
        ctx.strokeStyle = 'rgba(47, 128, 237, 0.6)';
      }

      ctx.beginPath();
      ctx.arc(myPosRef.current.x, myPosRef.current.y, RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = auraGrad;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.restore();

      // Remote Avatars
      usersRef.current.forEach((u) => {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;

        ctx.beginPath();
        ctx.arc(u.x, u.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = u.color || '#2F80ED';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = u.privacyMode === 'private' ? '#8B5CF6' : '#FFFFFF';
        ctx.stroke();
        ctx.restore();

        // Icon
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(u.avatarIcon || '👤', u.x, u.y);

        // Name Tag
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillStyle = '#0F172A';
        ctx.fillText(u.name, u.x, u.y - 30);

        if (meeting?.active) {
          ctx.fillStyle = '#059669';
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.fillText('🎙️ In Meeting', u.x, u.y + 32);
        } else if (u.privacyMode === 'private') {
          ctx.fillStyle = '#8B5CF6';
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.fillText('🔒 Private Bubble', u.x, u.y + 32);
        } else if (u.privacyMode === 'dnd') {
          ctx.fillStyle = '#EF4444';
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.fillText('⛔ Do Not Disturb', u.x, u.y + 32);
        }
      });

      // Local Avatar
      ctx.save();
      ctx.shadowColor = 'rgba(47, 128, 237, 0.4)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 5;

      ctx.beginPath();
      ctx.arc(myPosRef.current.x, myPosRef.current.y, 24, 0, Math.PI * 2);
      ctx.fillStyle = profile.color;
      ctx.fill();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
      ctx.restore();

      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(profile.avatarIcon, myPosRef.current.x, myPosRef.current.y);

      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#0F172A';
      ctx.fillText(`${profile.name} (You)`, myPosRef.current.x, myPosRef.current.y - 34);

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [furniture, privacyMode, profile, checkCollision, meeting]);

  // Click on canvas to walk
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    initAudioContext();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = Math.round(e.clientX - rect.left);
    const clickY = Math.round(e.clientY - rect.top);

    if (!checkCollision(clickX, clickY)) {
      myPosRef.current = { x: clickX, y: clickY };
      socketRef.current?.emit('move', { x: clickX, y: clickY });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/room/${roomCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleMic = () => {
    const unmuted = toggleMicrophone();
    setIsMuted(!unmuted);
  };

  const handleChangePrivacy = (mode: 'open' | 'private' | 'dnd') => {
    setPrivacyMode(mode);
    socketRef.current?.emit('set-privacy-mode', {
      mode,
      bubbleId: mode === 'private' ? `bubble-${socketRef.current?.id}` : null
    });
  };

  const handleStartQuickMeeting = () => {
    socketRef.current?.emit('start-meeting', {
      type: 'all',
      topic: meetingTopic
    });
    setShowMeetingModal(false);
  };

  const handleEndMeeting = () => {
    socketRef.current?.emit('end-meeting');
  };

  const handleKnock = () => {
    if (!nearbyPrivateUser) return;
    socketRef.current?.emit('knock-bubble', { targetSocketId: nearbyPrivateUser.socketId });
    alert(`Sent knock to ${nearbyPrivateUser.name}'s private bubble!`);
  };

  const handleAcceptKnock = () => {
    if (!knockPending) return;
    socketRef.current?.emit('accept-knock', {
      visitorSocketId: knockPending.fromSocketId,
      bubbleId: knockPending.bubbleId
    });
    setKnockPending(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#F1ECE7] overflow-hidden select-none">
      {/* Active Meeting Banner */}
      {meeting?.active && (
        <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-semibold shadow-md z-30 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide">🎙️ Live Quick Meeting Active:</span>
              <span className="text-emerald-100 font-medium">"{meeting.topic}"</span>
              <span className="text-emerald-200">· Host: {meeting.hostName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-emerald-100">All avatars connected regardless of distance</span>
            <button
              onClick={handleEndMeeting}
              className="px-3 py-1 bg-white text-emerald-800 hover:bg-emerald-50 rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              End Meeting
            </button>
          </div>
        </div>
      )}

      {/* Top Workspace Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#E3DCD5] px-6 py-3 flex items-center justify-between shadow-xs z-10">
        <div className="flex items-center gap-4">
          <Link
            to="/app"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-navy hover:bg-surface-bg transition-colors"
          >
            <Home size={14} className="text-primary" />
            <span>Dashboard</span>
          </Link>

          <div className="h-5 w-px bg-border" />

          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{profile.avatarIcon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-navy text-sm leading-tight">{roomName}</h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-primary-light text-primary border border-primary/20">
                  {roomCode}
                </span>
                {isLeader && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Leader
                  </span>
                )}
              </div>
              <p className="text-[11px] text-text-muted mt-0.5 flex items-center gap-2">
                <span>Move: <kbd className="px-1 py-0.2 bg-gray-100 rounded text-gray-700 text-[9px] font-bold border">WASD</kbd> or Click</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Users size={12} /> {activeUsersCount} online</span>
              </p>
            </div>
          </div>
        </div>

        {/* Center Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-border text-xs text-navy font-medium shadow-2xs">
            <Volume2 size={15} className={nearbyCount > 0 ? 'text-primary' : 'text-text-muted'} />
            <span>Earshot: <strong>{nearbyCount} teammate{nearbyCount !== 1 ? 's' : ''}</strong></span>
          </div>

          {/* Privacy Switcher */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-border">
            <button
              onClick={() => handleChangePrivacy('open')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                privacyMode === 'open' ? 'bg-white shadow-xs text-primary' : 'text-text-muted hover:text-navy'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => handleChangePrivacy('private')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                privacyMode === 'private' ? 'bg-white shadow-xs text-purple-600' : 'text-text-muted hover:text-navy'
              }`}
            >
              <Lock size={12} /> Private
            </button>
            <button
              onClick={() => handleChangePrivacy('dnd')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                privacyMode === 'dnd' ? 'bg-white shadow-xs text-red-600' : 'text-text-muted hover:text-navy'
              }`}
            >
              DND
            </button>
          </div>
        </div>

        {/* Right Actions: Quick Meeting, Mic, Invite, Leave */}
        <div className="flex items-center gap-2">
          {/* Quick Meeting Button */}
          {meeting?.active ? (
            <button
              onClick={handleEndMeeting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-all"
            >
              <PhoneOff size={14} />
              <span>End Call</span>
            </button>
          ) : (
            <button
              onClick={() => setShowMeetingModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all"
              title="Broadcast a quick meeting call to all members"
            >
              <Radio size={14} className="animate-pulse" />
              <span>Quick Meeting</span>
            </button>
          )}

          {/* Mic Button */}
          <button
            onClick={handleToggleMic}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
              isMuted
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {isMuted ? <MicOff size={15} /> : <Mic size={15} />}
            <span>{isMuted ? 'Muted' : 'Mic Live'}</span>
          </button>

          {/* Share Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-border text-navy hover:bg-gray-50 transition-all shadow-2xs"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Invite'}</span>
          </button>

          {/* Leave Button */}
          <button
            onClick={() => navigate('/app')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-gray-100 text-text-muted hover:text-danger hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
          >
            <LogOut size={14} />
            <span>Leave</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-auto bg-[#e5ded6] flex items-center justify-center p-4">
        {/* Knock Prompt overlay */}
        {nearbyPrivateUser && privacyMode !== 'private' && (
          <div className="absolute top-8 z-20 bg-white shadow-xl rounded-xl border border-purple-200 px-5 py-3.5 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-lg">
              🔒
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy">Private Bubble Encountered</h4>
              <p className="text-xs text-text-muted">
                {nearbyPrivateUser.name} is in a private conversation. Knock to request entry.
              </p>
            </div>
            <button
              onClick={handleKnock}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 shadow-sm"
            >
              Knock
            </button>
          </div>
        )}

        {/* Incoming Knock Alert Modal */}
        {knockPending && (
          <div className="absolute top-8 z-30 bg-white shadow-2xl rounded-xl border border-primary p-4 max-w-sm w-full animate-in zoom-in-95">
            <h4 className="text-sm font-bold text-navy mb-1">Knock at the Door 🚪</h4>
            <p className="text-xs text-text-muted mb-3">
              <strong>{knockPending.fromName}</strong> is outside your private bubble and asking to join.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleAcceptKnock}
                className="flex-1 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover"
              >
                Let In
              </button>
              <button
                onClick={() => setKnockPending(null)}
                className="flex-1 py-1.5 bg-gray-100 text-navy text-xs font-semibold rounded-lg hover:bg-gray-200"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {/* Quick Meeting Dialog Modal */}
        {showMeetingModal && (
          <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-border animate-in zoom-in-95">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <PhoneCall size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-navy text-base">Quick Team Meeting</h3>
                  <p className="text-xs text-text-muted">Broadcast to all office members</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
                    Meeting Topic / Goal
                  </label>
                  <input
                    type="text"
                    value={meetingTopic}
                    onChange={(e) => setMeetingTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Quick Standup, Bug Triage"
                  />
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Starting a Quick Meeting allows every active avatar on the map to hear and speak without proximity distance falloff.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMeetingModal(false)}
                  className="flex-1 py-2 text-xs font-semibold border border-border rounded-lg text-navy hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartQuickMeeting}
                  className="flex-1 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
                >
                  Start Meeting
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Realistic Office Canvas (1400 x 800) */}
        <canvas
          ref={canvasRef}
          width={1400}
          height={800}
          onClick={handleCanvasClick}
          className="rounded-2xl shadow-2xl border-4 border-[#C7BDB1] cursor-pointer transition-shadow"
        />
      </div>
    </div>
  );
};
