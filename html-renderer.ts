import { Display } from './constants';

const getColor = (d : Display) : String => {
  switch (+d)
  {
    default: return 'white';
    case Display.player: return 'cornflowerblue';
    case Display.invader: return 'gray';
    case Display.collision: return 'red';
    case Display.shot: return 'silver';
  }
};

const createElem = col => {
  const elem = document.createElement('div');
  elem.classList.add('board');
  elem.style.display = 'inline-block';
  elem.style.marginLeft = '10px';
  elem.style.height = '6px';
  elem.style.width = '6px';
  elem.style['background-color'] = getColor(col);
  elem.style['border-radius'] = '90%';
  return elem;
}

export const paint = (game: number[][], playerLives: number, score: number, isGameOver: boolean) => {
  document.body.innerHTML = '';
  document.body.innerHTML += `Score: ${score} Lives: ${playerLives}`;

  if (isGameOver) {
    document.body.innerHTML += ' GAME OVER!';
    return;
  }

  game.forEach (row => {
    const rowContainer = document.createElement('div');
    row.forEach(col => rowContainer.appendChild(createElem(col)));
    document.body.appendChild(rowContainer);
  });

};