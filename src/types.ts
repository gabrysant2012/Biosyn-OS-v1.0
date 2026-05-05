export enum AppId {
  COMMS = 'comms',
  LOGS = 'logs',
  PERSONNEL = 'personnel',
  ENVIRONMENT = 'environment',
  RADAR = 'radar',
  POWER = 'power',
  SURVEILLANCE = 'surveillance'
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  position: { x: number; y: number };
  isOnline: boolean;
  status: 'active' | 'noise' | 'offline';
  imageUrl?: string;
}

export interface Dinosaur {
  id: string;
  species: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  diet: 'Herbivore' | 'Carnivore' | 'Omnivore';
  status: 'Stable' | 'Breached' | 'Unknown' | 'Tracking';
  enclosure: string;
  position: { x: number; y: number };
}

export interface Personnel {
  id: string;
  name: string;
  role: string;
  status: string;
  details: string;
  active: boolean;
  position?: { x: number; y: number };
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'Info' | 'Warning' | 'Alert' | 'Critical';
  message: string;
  location: string;
}
