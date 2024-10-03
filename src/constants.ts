export const BUCKET_URL = import.meta.env.VITE_BUCKET_URL;
export const CREDENTIALS = JSON.parse(import.meta.env.VITE_CREDENTIALS);

export interface Card {
  comments: string;
  discuss: boolean;
  name: string;
  represents: boolean;
  status: string;
}

export enum Role {
  Admin = 'Admin',
  Manager = 'Manager',
  Spectator = 'Spectator',
}
