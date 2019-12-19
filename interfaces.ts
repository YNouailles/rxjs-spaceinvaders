import { ActionType } from './constants';

export interface Position {
  x: number;
  y: number;
}

export interface Invader {
  pos: Position;
  direction: number;  // -1 or +1
}

export interface State {
  playerX: number;
  shots: Position[];
  invaders: Invader[];
  collisions: Position[];
  score: number;
}

export interface Action {
  action: ActionType;
  payload: any;
}