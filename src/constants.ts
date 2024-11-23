export const BUCKET_URL = import.meta.env.VITE_BUCKET_URL;
export const BUCKET_KEY = import.meta.env.VITE_BUCKET_KEY;
export const CREDENTIALS = JSON.parse(atob(import.meta.env.VITE_CREDENTIALS));

export interface OldCard {
  comments: string;
  discuss: boolean;
  name: string;
  represents: boolean;
  status: string;
  logs: string;
}

export enum Status {
  Banned = 'Banned',
  Allowed = 'Allowed',
}

export enum Role {
  Admin = 'Admin',
  Manager = 'Manager',
  Spectator = 'Spectator',
}

export enum Color {
  BannedRed = '#e65a5a', //[color:#e65a5a] bg-[#e65a5a]
  AllowedGreen = '#8fd177', //[color:#8fd177] bg-[#8fd177]
  UndecidedYellow = '#dbd556', //[color:#dbd556] bg-[#dbd556]
  White = 'white',
}

export interface Comment {
  poster: string;
  timestamp: Date;
  message: string;
}

export interface Log {
  from: Status | '';
  to: Status | '';
  timestamp: Date;
  user: string;
}

export interface Card {
  id: string;
  name: string;
  status: Status;
  comments: Comment[];
  logs: Log[];
  markedForDiscussion: boolean;
}

export interface Category {
  id: string;
  name: string;
  status: Status;
  exampleCards: string[];
  comments: Comment[];
  logs: Log[];
  markedForDiscussion: boolean;
}

export interface CardCategory {
  id: string;
  name: string;
  status: Status;
  exampleCards: string[];
  comments: Comment[];
  logs: Log[];
  markedForDiscussion: boolean;
}
