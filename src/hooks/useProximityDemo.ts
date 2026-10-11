import { useState, useCallback, useEffect } from 'react';
import { Teammate } from '../types/landing';

const ROOM_WIDTH = 580;
const ROOM_HEIGHT = 380;
const HEARING_RADIUS = 120; // Radius in virtual demo units
const STEP_SPEED = 14;

export const useProximityDemo = () => {
  const initialUserPos = { x: 120, y: 190 };

  const initialTeammates: Teammate[] = [
    { id: 'ravi', name: 'Ravi', x: 280, y: 150, avatarColor: '#10B981', status: 'speaking' },
    { id: 'meera', name: 'Meera', x: 440, y: 260, avatarColor: '#8B5CF6', status: 'active' },
  ];

  const [userPos, setUserPos] = useState(initialUserPos);
  const [teammates] = useState<Teammate[]>(initialTeammates);
  const [isFocused, setIsFocused] = useState(false);

  // Clamp within boundaries
  const clampPos = useCallback((x: number, y: number) => {
    const padding = 24;
    return {
      x: Math.max(padding, Math.min(ROOM_WIDTH - padding, x)),
      y: Math.max(padding, Math.min(ROOM_HEIGHT - padding, y)),
    };
  }, []);

  // Move user avatar
  const moveUser = useCallback((dx: number, dy: number) => {
    setUserPos((prev) => clampPos(prev.x + dx, prev.y + dy));
  }, [clampPos]);

  // Set position directly (e.g. from drag or click)
  const setUserCoordinates = useCallback((x: number, y: number) => {
    setUserPos(clampPos(x, y));
  }, [clampPos]);

  // Reset to initial
  const resetDemo = useCallback(() => {
    setUserPos(initialUserPos);
  }, []);

  // Compute distance and qualitative sound level
  const computedTeammates = teammates.map((t) => {
    const dist = Math.hypot(t.x - userPos.x, t.y - userPos.y);
    const inRange = dist <= HEARING_RADIUS;
    
    // Quadratic attenuation factor for visual volume (0..100%)
    let volumePercent = 0;
    let statusLabel: 'Nearby' | 'In range' | 'Far away' = 'Far away';

    if (inRange) {
      volumePercent = Math.round(Math.max(0, 1 - dist / HEARING_RADIUS) ** 1.8 * 100);
      if (volumePercent >= 65) {
        statusLabel = 'Nearby';
      } else {
        statusLabel = 'In range';
      }
    }

    return {
      ...t,
      distance: Math.round(dist),
      volumePercent,
      inRange,
      statusLabel,
    };
  });

  // Keyboard navigation when demo area is focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused) return;

      const key = e.key.toLowerCase();
      let handled = false;

      if (key === 'w' || key === 'arrowup') {
        moveUser(0, -STEP_SPEED);
        handled = true;
      } else if (key === 's' || key === 'arrowdown') {
        moveUser(0, STEP_SPEED);
        handled = true;
      } else if (key === 'a' || key === 'arrowleft') {
        moveUser(-STEP_SPEED, 0);
        handled = true;
      } else if (key === 'd' || key === 'arrowright') {
        moveUser(STEP_SPEED, 0);
        handled = true;
      }

      if (handled) {
        e.preventDefault(); // Prevent page scrolling while playing with demo
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, moveUser]);

  return {
    userPos,
    roomWidth: ROOM_WIDTH,
    roomHeight: ROOM_HEIGHT,
    hearingRadius: HEARING_RADIUS,
    computedTeammates,
    moveUser,
    setUserCoordinates,
    resetDemo,
    isFocused,
    setIsFocused,
  };
};
