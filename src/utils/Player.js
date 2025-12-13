import { Board } from './Board';

export const Player = (type) => {
  const name = type;
  const board = Board();
  const isReady = () => board.allPlaced();
  const hasLost = () => board.areAllDead();

  return {
    name,
    board,
    isReady,
    hasLost,
  };
};
