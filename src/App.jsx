import React from 'react';
import './App.css';

import { Board } from './utils/Board';
import GameBoard from './components/GameBoard/GameBoard';

const playerBoard = Board();
console.log(playerBoard);

function App() {
  return <GameBoard board={playerBoard} />;
}

export default App;
