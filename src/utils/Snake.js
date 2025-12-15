export const Snake = (snake) => {
  const name = snake.name;
  const size = snake.size;
  let hits = 0;
  const cells = [];

  const isPlaced = () => cells.length > 0;
  const isDead = () => hits >= size;
  const hit = () => hits++;
  const reset = () => {
    hits = 0;
    cells.length = 0;
  };

  return {
    name,
    size,
    hits,
    cells,
    isPlaced,
    hit,
    isDead,
    reset,
  };
};
