
export enum Team {
  Viewer = 'viewer',
  Controller = 'controller',
}

export enum GameState {
  PreGame = 'pre-game',
  Running = 'running',
  Won = 'won',
}

export enum CellType {
  Empty = 0,
  Wall = 1,
  Goal = 2,
}

export interface Position {
  x: number;
  y: number;
}

export interface Message {
  id: number;
  text: string;
  isFinal: boolean;
}
