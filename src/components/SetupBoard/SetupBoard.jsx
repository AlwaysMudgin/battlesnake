import React from 'react';
import styles from './SetupBoard.module.css';

function SetupBoard({ phase, board, start, playTrack }) {
  const [selectedSnake, setSelectedSnake] = React.useState(
    board.getSelectedSnake()
  );
  const [previewCells, setPreviewCells] = React.useState([]);
  const [placementValid, setPlacementValid] = React.useState();
  const [unplacedSnakes, setUnplacedSnakes] = React.useState(
    board.getUnplaced()
  );
  const [errorMessage, setErrorMessage] = React.useState('');

  function handleMouseEnter(row, col) {
    if (unplacedSnakes.length < 1) {
      return;
    }
    const placementCells = board.getPlacementCells(row, col);
    const validate = board.validatePlacementCells(placementCells);
    setPreviewCells(placementCells);
    setPlacementValid(validate);
  }

  function getPreviewStyles(row, col, cell) {
    let style = `${styles.cell}`;
    const isPreviewed = previewCells.some(
      ({ row: previewRow, col: previewCol }) =>
        row === previewRow && col === previewCol
    );
    if (isPreviewed) {
      placementValid
        ? (style += ` ${styles.valid}`)
        : (style += ` ${styles.invalid}`);
    }
    if (cell.snake) {
      style += ` ${styles[cell.snake.name.toLowerCase()]}`;
    }
    return style;
  }

  function handlePlacement(row, col) {
    const result = board.placeSnake(board.getPlacementCells(row, col));
    if (!result) {
      setErrorMessage('Invalid placement');
      return;
    }
    setErrorMessage('');
    setUnplacedSnakes(board.getUnplaced());
    setSelectedSnake(board.getSelectedSnake());
    setPreviewCells([]);
    playTrack('snake');
  }

  function handleSelect(snakeName) {
    playTrack('snake');
    board.changeSelected(snakeName);
    setSelectedSnake(board.getSelectedSnake());
  }

  function handleRandom() {
    board.placeAllRandom();
    setSelectedSnake(board.getSelectedSnake());
    setUnplacedSnakes(board.getUnplaced());
    setErrorMessage('');
    playTrack('snake');
  }

  return (
    <div
      className={`${styles.container} ${phase === 'intro' ? styles.hide : ''}`}
    >
      <div>
        <div className={styles.board}>
          {board.cells.map((row, rowIndex) => {
            return (
              <div className={styles.row} key={rowIndex}>
                {row.map((col, colIndex) => {
                  return (
                    <button
                      key={colIndex}
                      className={getPreviewStyles(rowIndex, colIndex, col)}
                      onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                      onMouseLeave={() => setPreviewCells([])}
                      onClick={() => handlePlacement(rowIndex, colIndex)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      </div>
      <div className={styles.controls}>
        <div className={styles.snakes}>
          {unplacedSnakes.map((snake) => {
            return (
              <div
                key={snake.name}
                className={`${styles.snake} ${
                  snake.name === selectedSnake.name ? styles.selected : ''
                }`}
                onClick={() => handleSelect(snake.name)}
              >
                <h1>{snake.name}</h1>
                <div className={styles.pips}>
                  {Array(snake.size)
                    .fill(null)
                    .map((val, index) => (
                      <div key={index} className={styles.pip}></div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
        {unplacedSnakes.length > 0 && (
          <>
            <button onClick={() => board.changeAxis()}>Change Axis</button>
            <button onClick={handleRandom}>Randomize</button>
          </>
        )}
        {unplacedSnakes.length < 1 && (
          <button onClick={start}>Start Game</button>
        )}
      </div>
    </div>
  );
}

export default SetupBoard;
