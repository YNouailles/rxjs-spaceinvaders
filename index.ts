import { of, fromEvent, interval, merge, Observable} from 'rxjs'; 
import { map, filter, debounceTime, scan, take } from 'rxjs/operators';
import { gameSize, empty, player, shot, invader} from './constants';
import { paint } from './html-renderer';

/*
const moves = fromEvent<KeyboardEvent>(document, 'keydown')
const moves_filtered = moves.pipe(filter(x=> x.code.startsWith('Arrow'))) // or == ArrowLeft, ArrowRight
const moves_filtered_debounced = moves.pipe(debounceTime(10))
*/

const moves = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
  filter(x=> x.code == 'ArrowLeft' || x.code == 'ArrowRight'),
  debounceTime(10)
)

const shots = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
  filter(x=> x.code.startsWith('Space')),
  debounceTime(10)
)

//moves.subscribe(x => console.log(x.code));
//shots.subscribe(x => console.log("shot!"));

interface Pos {
  x: number;
  y: number;
}

interface Monster {
  pos: Pos;
  direction: number;
}

interface State {
  playerX: number;
  shots: Pos[];
  monsters: Monster[];
}

interface Action {
  action: string;
  obj: any;
}

const initialState : State = {
  playerX: gameSize/2,
  shots: [],
  monsters: []
};

class SpaceInvaders {

  private gameLoop: Observable<State>;

  constructor() {
    const moves = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    filter(x=> x.code == 'ArrowLeft' || x.code == 'ArrowRight'),
    debounceTime(10));

    const shots = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    filter(x=> x.code.startsWith('Space')),
    debounceTime(10));

    const positionUpdate = (x: number, input: KeyboardEvent): number => {
      x = input.code == 'ArrowLeft' ? x-1 : x+1;
      return Math.min(Math.max(x, 0), gameSize)
    };

    const gameUpdate = (state: State, input: Action): State => {
      if (input.action == 'move')
        state.playerX = positionUpdate(state.playerX, input.obj);
      else if (input.action == 'shot')
        state.shots.push(<Pos>{x:state.playerX, y:gameSize-1});
      else if (input.action == 'monster')
        state.monsters.push(input.obj)
      else if (input.action == 'refresh')
      {
        state.shots.forEach(p => p.y = p.y - 1);
        state.shots = state.shots.filter(p => p.y >= 0);
        state.monsters.forEach(m => {
          if (m.pos.x + m.direction < 0 || m.pos.x + m.direction == gameSize -1) {
            m.pos.y++; m.direction = -m.direction;
          }   
          m.pos.x = m.pos.x + m.direction
          console.log(m.pos)
        });
        state.monsters = state.monsters.filter(m => m.pos.y >= 0 && m.pos.y < gameSize);
      }
      console.log(state.playerX)
      return state;
    };

    const monsterGen = interval(1000).pipe(
      map (x =>  <Action>{ action:'monster', obj:<Monster>{pos: {x:gameSize/2, y:0}, direction: 1} } ),
      take(20)
    );

    this.gameLoop = merge(
      moves.pipe(map(x => <Action>{ action:'move', obj:x })),
      shots.pipe(map(x => <Action>{ action:'shot', obj:x })),
      interval(1000).pipe(map(x => <Action>{ action:"refresh", obj:x } )),
      monsterGen
    ).pipe(scan(gameUpdate, initialState));

  }

  public start(playerLives: number) {
    this.gameLoop.subscribe(state => paint(this.getGame(state, playerLives, 0, false)));
  }

  public end() {
  }

  private getGame(state: State): number[][] {
    var game: number[][] = [  
    [gameSize],  
    [gameSize]  
    ];
    for (var i = 0; i < gameSize; ++i)
    {
      game[i] = [];
      for (var j = 0; j < gameSize; ++j)
        game[i][j] = empty;
    }

    game[gameSize-1][state.playerX] = player
    state.shots.forEach(s => game[s.y][s.x] = shot)
    state.monsters.forEach(m => game[m.pos.y][m.pos.x] = invader)
    return game;
  }
}

const game = new SpaceInvaders();
game.start(3);
