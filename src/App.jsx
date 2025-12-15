import React from 'react';
import './App.css';

import { GameController } from './utils/GameController';
import Intro from './components/Intro/Intro';
import SetupBoard from './components/SetupBoard/SetupBoard';
import PlayBoard from './components/PlayBoard/PlayBoard';
import AttackLog from './components/AttackLog/AttackLog';

import IntroTrack from './assets/audio/Intro.mp3';
import MainLoopDubbed from './assets/audio/MainLoopDubbed.mp3';
import Angry from './assets/audio/Angry.mp3';
import Bluffing from './assets/audio/Bluffing.mp3';
import Cranky from './assets/audio/Cranky.mp3';
import FoundHim from './assets/audio/FoundHim.mp3';
import Maniac from './assets/audio/Maniac.mp3';
import Rattle1 from './assets/audio/Rattle1.mp3';
import Rattle2 from './assets/audio/Rattle2.mp3';
import Rattle3 from './assets/audio/Rattle3.mp3';
import Smiling from './assets/audio/Smiling.mp3';
import Snake from './assets/audio/Snake.mp3';
import TilDeath from './assets/audio/TilDeath.mp3';

import { Volume, VolumeX } from 'react-feather';

const game = GameController();

function App() {
  const [phase, setPhase] = React.useState(game.getPhase());
  const [playerTurn, setPlayerTurn] = React.useState(game.isPlayerTurn());
  const [mute, setMute] = React.useState(false);
  const [track, setTrack] = React.useState({ src: null });

  console.log(track);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current
        .play()
        .catch((err) => console.log('Autoplay prevented', err));
    }
  }, [track]);

  const turns = { playerTurn, setPlayerTurn };

  const audioRef = React.useRef();

  function playTrack(type) {
    if (type === 'intro') {
      const ref = { src: IntroTrack };
      setTrack({ ...ref });
      return;
    }

    if (type === 'loop') {
      const ref = { src: MainLoopDubbed };
      setTrack({ ...ref });
      return;
    }

    if (type === 'snake') {
      const ref = { src: Snake };
      setTrack({ ...ref });
      return;
    }

    const hits = [Cranky, FoundHim, Maniac, Snake, TilDeath];
    const misses = [Angry, Bluffing, Smiling, Rattle1, Rattle2, Rattle3];

    if (type === 'hit') {
      const index = Math.floor(Math.random() * (hits.length - 1));
      console.log(index, hits[index]);
      const ref = { src: hits[index] };
      setTrack({ ...ref });
      console.log('playing ', hits[index]);
      return;
    }
    if (type === 'miss') {
      const index = Math.floor(Math.random() * (misses.length - 1));
      console.log(index, misses[index]);
      const ref = { src: misses[index] };
      setTrack({ ...ref });
      console.log('playing ', misses[index]);
      return;
    }
  }

  function handleTrackEnd() {
    console.log('track end fired');
    if (track.src === IntroTrack || track.src === MainLoopDubbed) {
      playTrack('loop');
    }
  }

  function startSetup() {
    if (game.getPhase() === 'intro') {
      game.setup();
      playTrack('loop');
      setPhase(game.getPhase());
    }
  }

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

  function endMessage() {
    const winner = game.getWinner();
    if (winner === 'player') return 'You win!';
    if (winner === 'opponent') return 'Opponent wins!';
  }

  function handleMuteClick() {
    setMute(!mute);
    console.log('mute click fired');
  }

  function handleNewGame() {
    game.newGame();
    setPhase(game.getPhase());
    playerTurn(game.isPlayerTurn());
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={track.src}
        onEnded={handleTrackEnd}
        muted={mute}
      ></audio>
      <button className="mute" onClick={handleMuteClick}>
        {mute ? <VolumeX /> : <Volume />}
      </button>
      <Intro phase={phase} startSetup={startSetup} />
      {(phase === 'intro' || phase === 'setup') && (
        <div className="setup-container">
          <SetupBoard
            phase={phase}
            board={game.player.board}
            start={startBattle}
            playTrack={playTrack}
          />
        </div>
      )}
      {(phase === 'battle' || phase === 'end') && (
        <div className="play-container">
          <h1 className="turn">
            {phase === 'end' ? (
              <>
                <h1>{endMessage()}</h1>
                <button onClick={handleNewGame}>Play Again</button>
              </>
            ) : playerTurn ? (
              'Your Turn'
            ) : (
              "Opponent's Turn"
            )}
          </h1>
          <div className="boards">
            <div className="player">
              <PlayBoard
                player={game.player}
                game={game}
                turns={turns}
                checkEnd={checkEnd}
                phase={phase}
              />
              <h2>Your Board</h2>
            </div>
            <div className="opponent">
              <PlayBoard
                player={game.opponent}
                game={game}
                turns={turns}
                checkEnd={checkEnd}
                playTrack={playTrack}
                phase={phase}
              />
              <h2>Opponent's Board</h2>
            </div>
          </div>
          <AttackLog log={game.attackLog} />
        </div>
      )}
    </>
  );
}

export default App;
