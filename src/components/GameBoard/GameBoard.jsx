import React from 'react';
import styles from './GameBoard.module.css';

function GameBoard({ board }) {
  const [selectedSnake, setSelectedSnake] = React.useState(board.selectedSnake);
  const [previewCells, setPreviewCells] = React.useState([]);
  const [placementValid, setPlacementValid] = React.useState();

  function handleMouseEnter(row, col) {
    const placementCells = board.getPlacementCells(row, col);
    const validate = board.validatePlacementCells(placementCells);
    setPreviewCells(placementCells);
    setPlacementValid(validate);
  }

  function getPreviewStyles(row, col) {
    let style = `${styles.cell}`;
    const isPreviewed = previewCells.some(
      ({ row: previewRow, col: previewCol }) =>
        row === previewRow && col === previewCol
    );
    if (isPreviewed) {
      if (placementValid) {
        style += ` ${styles.valid}`;
      } else {
        style += ` ${styles.invalid}`;
      }
    }
    return style;
  }

  return (
    <div className={styles['board-container']}>
      {board.cells.map((row, rowIndex) => {
        return (
          <div className={styles.row} key={rowIndex}>
            {row.map((col, colIndex) => {
              return (
                <div
                  key={colIndex}
                  className={getPreviewStyles(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                >
                  {col}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default GameBoard;
