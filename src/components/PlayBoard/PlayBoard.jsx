import React from 'react';
import styles from './PlayBoard.module.css';
import { Circle, XCircle } from 'react-feather';

function PlayBoard({ player, game, turns, checkEnd, playTrack, phase }) {
  const [hoverCell, setHoverCell] = React.useState();
  const { playerTurn, setPlayerTurn } = turns;

  React.useEffect(() => {
    function opponentAttack() {
      if (playerTurn) return;
      const attack = game.opponentAttack();
      checkEnd();
      setPlayerTurn(game.isPlayerTurn());
      return attack;
    }
    console.log('Opponent turn...');
    const opponentTurn = setTimeout(opponentAttack, 2000);

    return () => clearTimeout(opponentTurn);
  }, [game, playerTurn, setPlayerTurn, checkEnd]);

  function getCellStyles(row, col, cell) {
    let style = `${styles.cell}`;

    if (player.name === 'player' && cell.snake) {
      style += ` ${styles[cell.snake.name.toLowerCase()]}`;
    }

    if (cell.shot) {
      if (cell.snake) {
        style += ` ${styles.hit}`;
      } else {
        style += ` ${styles.miss}`;
      }
    }

    if (hoverCell && row === hoverCell.row && col === hoverCell.col) {
      if (!cell.shot) {
        style += ` ${styles.target}`;
      }
    }

    return style;
  }

  function handleMouseEnter(row, col) {
    if (phase === 'end') return;
    if (player.name === 'opponent' && playerTurn) {
      setHoverCell({ row, col });
    }
  }

  function handleMouseLeave() {
    if (phase === 'end') return;
    if (player.name === 'opponent' && playerTurn) {
      setHoverCell();
    }
  }

  function handleClick(row, col) {
    if (
      phase === 'end' ||
      player.name === 'player' ||
      !game.isPlayerTurn() ||
      player.board.cells[row][col].shot
    )
      return;

    const attack = game.playerAttack(row, col);
    console.log(attack);

    playTrack(attack.result);

    if (checkEnd()) return;

    setPlayerTurn(game.isPlayerTurn());
  }

  return (
    <div className={styles.board}>
      {player.board.cells.map((row, rowIndex) => {
        return (
          <div className={styles.row} key={rowIndex}>
            {row.map((col, colIndex) => {
              return (
                <button
                  key={colIndex}
                  className={getCellStyles(rowIndex, colIndex, col)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  onMouseLeave={() => handleMouseLeave(rowIndex, colIndex)}
                  onClick={() => handleClick(rowIndex, colIndex)}
                >
                  {!col.shot ? (
                    ''
                  ) : col.snake ? (
                    <XCircle color="red" size={32} />
                  ) : (
                    <Circle color="silver" size={32} />
                  )}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default PlayBoard;
