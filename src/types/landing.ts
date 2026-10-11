export interface Teammate {
  id: string;
  name: string;
  x: number;
  y: number;
  avatarColor: string;
  status: 'active' | 'speaking' | 'idle';
}

export interface ProximityState {
  userPos: { x: number; y: number };
  teammates: Teammate[];
  nearbyTeammates: {
    id: string;
    name: string;
    distance: number;
    volumePercent: number;
    statusLabel: 'Nearby' | 'In range' | 'Far away';
  }[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FeatureCardItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}
