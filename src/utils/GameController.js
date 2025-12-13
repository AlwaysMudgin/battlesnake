import { Player } from './Player';

export const GameController = () => {
  const player = Player('player');
  const opponent = Player('opponent');

  opponent.board.placeAllRandom();

  let phase = 'setup';
  const getPhase = () => phase;

  let playerTurn = true;
  const isPlayerTurn = () => playerTurn;
  const nextTurn = () => (playerTurn = !playerTurn);

  const allReady = () => player.isReady() && opponent.isReady();

  const battle = () => {
    if (!player.isReady() || !opponent.isReady()) return;
    phase = 'battle';
  };

  const playerAttack = (row, col) => {
    if (!playerTurn) return;
    const attack = opponent.board.receiveAttack(row, col);
    if (attack.result === 'repeat') return;
    updateLog(attack);
    if (checkWinner()) {
      phase = 'end';
      return attack;
    }
    nextTurn();
    return attack;
  };

  const opponentAttack = () => {
    if (playerTurn) return;
    function randomAttack() {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      const attack = player.board.receiveAttack(row, col);
      if (attack.result !== 'repeat') {
        updateLog(attack);
        if (checkWinner()) {
          phase = 'end';
          return attack;
        }
        nextTurn();
        return attack;
      }
      randomAttack();
    }
    randomAttack();
  };

  const attackLog = [];
  function updateLog(attack) {
    const currentPlayer = isPlayerTurn() ? 'player' : 'opponent';
    attackLog.push({ player: currentPlayer, result: attack.result });
  }

  const checkWinner = () => {
    if (player.hasLost() || opponent.hasLost()) {
      return true;
    }
    return false;
  };

  return {
    player,
    opponent,
    getPhase,
    isPlayerTurn,
    nextTurn,
    allReady,
    battle,
    playerAttack,
    opponentAttack,
    attackLog,
    checkWinner,
  };
};
