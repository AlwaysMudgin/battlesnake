import { Snake } from './Snake';
import { SNAKES } from './constants';

export const Board = () => {
  const cells = getNewMap();
  const snakes = SNAKES.map((snake) => Snake(snake));
  let horizontal = true;

  const getUnplaced = () => snakes.filter((snake) => !snake.isPlaced());

  let selectedSnake = getUnplaced()[0];

  const getPlacementCells = (row, col) => {
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
      }
      if (cells[row][col] !== 'empty') {
        valid = false;
      }
    });
    return valid;
  };

  const placeSnake = (placementCells) => {
    if (!validatePlacementCells(placementCells)) return;
    const placedSnake = selectedSnake;

    placementCells.forEach(({ row, col }) => {
      cells[row][col] = placedSnake;
      placedSnake.cells.push([row, col]);
    });

    if (getUnplaced().length > 0) {
      selectedSnake = getUnplaced()[0];
    }

    return { snake: placedSnake, cells: placementCells };
  };

  const placeAllRandom = () => {
    getUnplaced().forEach((snake) => {
      selectedSnake = snake;
      let tries = 0;
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      if (Math.random() > 0.5) {
        horizontal = !horizontal;
      }

      while (tries < 100) {
        const placementCells = getPlacementCells(row, col);
        if (validatePlacementCells(placementCells)) {
          placeSnake(placementCells);
          return;
        }
        tries++;
      }
    });
  };

  const receiveAttack = (row, col) => {
    if (cells[row][col] === 'hit' || cells[row][col] === 'miss') {
      return { row, col, result: 'repeat' };
    }

    if (cells[row][col] === 'empty') {
      cells[row][col] = 'miss';
      return { row, col, result: 'miss' };
    }

    if (typeof cells[row][col] === 'object') {
      cells[row][col].hit();
      cells[row][col] = 'hit';
      return { row, col, result: 'hit' };
    }
  };

  const areAllDead = () =>
    snakes.filter((snake) => snake.isDead()).length === snakes.length;

  function getNewMap() {
    return Array(10)
      .fill(null)
      .map(() => Array(10).fill('empty'));
  }

  return {
    cells,
    snakes,
    selectedSnake,
    horizontal,
    getUnplaced,
    getPlacementCells,
    validatePlacementCells,
    placeSnake,
    placeAllRandom,
    receiveAttack,
    areAllDead,
  };
};
