import { ActionType, Display, gameSize, Direction } from "./constants";
import { Position, Invader, State, Action } from "./interfaces";
import { paint } from "./html-renderer";

import { of } from "rxjs";
import {} from "rxjs/operators";

const mapFromState = (state: State): number[][] => {
  var game = Array(gameSize)
    .fill(Display.empty)
    .map(e => Array(gameSize).fill(Display.empty));
  state.shots.forEach(s => (game[s.y][s.x] = Display.shot));
  state.invaders.forEach(m => (game[m.pos.y][m.pos.x] = Display.invader));
  state.collisions.forEach(c => (game[c.y][c.x] = Display.collision));
  game[gameSize - 1][state.playerX] = Display.player;
  return game;
};

const collide = (e1, e2) => e1.x === e2.x && e1.y === e2.y;

const positionUpdate = (x: number, input: KeyboardEvent): number => {
  x = input === Direction.Left ? x - 1 : x + 1;
  return Math.min(Math.max(x, 0), gameSize);
};

const invadersPositionUpdate = (inv: Invader): void => {
  if (inv.pos.x + inv.direction < 0 || inv.pos.x + inv.direction == gameSize) {
    inv.pos.y++;
    inv.direction = -inv.direction;
  }
  inv.pos.x += inv.direction;
};

const gameUpdate = (state: State, input: Action): State => {
  switch (input.action) {
    case ActionType.Move:
      state.playerX = positionUpdate(state.playerX, input.payload);
      break;
    case ActionType.Shot:
      state.shots.push(<Position>{ x: state.playerX, y: gameSize - 1 });
      break;
    case ActionType.InvaderPop:
      state.invaders.push(input.payload);
      break;
    case ActionType.Refresh: {
      state.shots.forEach(p => (p.y = p.y - 1));
      state.shots = state.shots.filter(p => p.y >= 0);
      state.collisions = state.shots.filter(s =>
        state.invaders.find(m => collide(s, m.pos))
      );
      state.invaders = state.invaders.filter(
        m => !state.collisions.find(c => collide(c, m.pos))
      );
      state.shots = state.shots.filter(
        s => !state.collisions.find(c => collide(c, s))
      );
      state.score += state.collisions.length * 10;
      state.invaders.map(invadersPositionUpdate);
      state.invaders = state.invaders.filter(
        m => m.pos.y >= 0 && m.pos.y < gameSize
      );
      break;
    }
  }
  return state;
};

/* Write an observables which map keyEvents to Actions like you did in exercice 2
  for Left  emit <Action>{ action:ActionType.Move, payload: Direction.Left }
  for Right emit <Action>{ action:ActionType.Move, payload: Direction.Right }
  for Shot  emit <Action>{ action:ActionType.Shot, payload: Position{x:? y:?} }

  the spaceship cannot go faster than 1 move every 100 ms
  the spaceship blaster maximum rate is 3 times per second
 */

// code it here

const initialState: State = {
  playerX: gameSize / 2,
  shots: [],
  invaders: [],
  collisions: [],
  score: 0
};

/* Modify gameloop$ to call game update on every event
*/

const gameloop$ = of(initialState);
gameloop$.subscribe(state => paint(mapFromState(state), 1, state.score, false));

/* find a way to refresh the visualisation every 100ms
  emit <Action>{ action:ActionType.Refresh, payload: time }
*/



/* add a new events to create new invaders every 300 ms and limit the number to 50 invaders
  emit <Action>{ action:ActionType.InvaderPop, payload: Position{x:? y:?} }
*/
