export const BUCKET_URL = import.meta.env.VITE_BUCKET_URL;
export const CREDENTIALS = JSON.parse(import.meta.env.VITE_CREDENTIALS);

export interface OldCard {
  comments: string;
  discuss: boolean;
  name: string;
  represents: boolean;
  status: string;
  logs: string;
}

export enum Status {
  New = 'New',
  Banned = 'Banned',
  Allowed = 'Allowed',
}

export enum Role {
  Admin = 'Admin',
  Manager = 'Manager',
  Spectator = 'Spectator',
}

export enum Color {
  BannedRed = '#e65a5a',
  AllowedGreen = '#8fd177',
  UndecidedYellow = '#dbd556',
}

export interface Comment {
  poster: string;
  timestamp: Date;
  message: string;
}

export interface Log {
  from: Status;
  to: Status;
  timestamp: Date;
}

export interface Card {
  name: string;
  status: Status;
  releaseDate: Date;
  comments: Comment[];
  logs: Log[];
  markedForDiscussion: boolean;
}

export interface CardCategory {
  name: string;
  status: Status;
  exampleCards: string[];
  comments: Comment[];
  logs: Log[];
  markedForDiscussion: boolean;
}
