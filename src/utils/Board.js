import { Snake } from './Snake.js';
import { SNAKES } from './constants.js';

export const Board = () => {
  const cells = getNewMap();
  const snakes = SNAKES.map((snake) => Snake(snake));
  let horizontal = true;

  const isHorizontal = () => horizontal;

  const getUnplaced = () => snakes.filter((snake) => !snake.isPlaced());

  let selectedSnake = snakes.find((snake) => snake.name === 'Anaconda');

  const changeSelected = (snakeName) => {
    selectedSnake = getUnplaced().find((snake) => snake.name === snakeName);
  };

  const getSelectedSnake = () => selectedSnake;

  const changeAxis = () => (horizontal = !horizontal);

  const getPlacementCells = (row, col) => {
    if (!selectedSnake) return;
    let placementCells = [];
    for (let i = 0; i < selectedSnake.size; i++) {
      if (horizontal) {
        placementCells.push({ row, col: col + i });
      } else {
        placementCells.push({ row: row + i, col });
      }
    }
    return placementCells;
  };

  const validatePlacementCells = (placementCells) => {
    let valid = true;
    placementCells.forEach(({ row, col }) => {
      if (row > 9 || col > 9) {
        valid = false;
      } else if (cells[row] && cells[row][col].snake) {
        valid = false;
      }
    });
    return valid;
  };

  const placeSnake = (placementCells) => {
    if (!validatePlacementCells(placementCells)) return false;
    const placedSnake = selectedSnake;
    console.log(placementCells);

    placementCells.forEach(({ row, col }) => {
      const currentCell = cells[row][col];
      console.log(currentCell);
      currentCell.snake = placedSnake;
      console.log(cells[row]);
      placedSnake.cells.push({ row, col });
    });

    getUnplaced().length > 0
      ? (selectedSnake = getUnplaced()[0])
      : (selectedSnake = null);

    return { snake: placedSnake, cells: placementCells };
  };

  const placeAllRandom = () => {
    getUnplaced().forEach((snake) => {
      console.log('placing ', snake.name);
      selectedSnake = snake;
      let tries = 0;

      while (tries < 100) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        if (Math.random() > 0.5) {
          horizontal = !horizontal;
        }
        console.log('try ', tries, 'row ', row, 'col ', col);
        const placementCells = getPlacementCells(row, col);
        if (validatePlacementCells(placementCells)) {
          placeSnake(placementCells);
          console.log('placed ', snake.name);
          return;
        }
        tries++;
      }
    });
  };

  const allPlaced = () => getUnplaced().length === 0;

  const receiveAttack = (row, col) => {
    if (cells[row][col].shot) {
      return { row, col, result: 'repeat' };
    }

    if (!cells[row][col].snake) {
      cells[row][col].shot = true;
      return { row, col, result: 'miss' };
    } else {
      cells[row][col].snake.hit();
      cells[row][col].shot = true;
      return { row, col, result: 'hit' };
    }
  };

  const areAllDead = () =>
    snakes.filter((snake) => snake.isDead()).length === snakes.length;

  function getNewMap() {
    const map = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => {
            const ref = { snake: false, shot: false };
            return { ...ref };
          })
      );

    return map;
  }

  function resetBoard() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        cells[i][j].snake = false;
        cells[i][j].shot = false;
      }
    }

    snakes.forEach((snake) => snake.reset());

    selectedSnake = snakes.find((snake) => snake.name === 'Anaconda');
  }

  return {
    cells,
    snakes,
    getSelectedSnake,
    changeSelected,
    isHorizontal,
    changeAxis,
    getUnplaced,
    getPlacementCells,
    validatePlacementCells,
    placeSnake,
    placeAllRandom,
    allPlaced,
    receiveAttack,
    areAllDead,
    resetBoard,
  };
};
