import React from 'react';
import './App.css';

import { GameController } from './utils/GameController';
import SetupBoard from './components/SetupBoard/SetupBoard';
import PlayBoard from './components/PlayBoard/PlayBoard';
import AttackLog from './components/AttackLog/AttackLog';

const game = GameController();

function App() {
  const [phase, setPhase] = React.useState(game.getPhase());
  const [playerTurn, setPlayerTurn] = React.useState(game.isPlayerTurn());

  const turns = { playerTurn, setPlayerTurn };

  function startBattle() {
    if (!game.allReady()) return;
    game.battle();
    setPhase(game.getPhase());
  }

  function checkEnd() {
    if (game.getPhase() === 'end') {
      setPhase('end');
      return true;
    }
  }

  if (phase === 'setup') {
    return <SetupBoard board={game.player.board} start={startBattle} />;
  }

  if (phase === 'battle') {
    return (
      <>
        <h1 className="turn">{playerTurn ? 'Your Turn' : "Opponent's Turn"}</h1>
        <div className="boards">
          <PlayBoard
            player={game.player}
            game={game}
            turns={turns}
            checkEnd={checkEnd}
          />
          <PlayBoard
            player={game.opponent}
            game={game}
            turns={turns}
            checkEnd={checkEnd}
          />
        </div>
        <AttackLog log={game.attackLog} />
      </>
    );
  }

  if (phase === 'end') {
    return <h1>Game Over</h1>;
  }
}

export default App;
