import React from 'react';

function AttackLog({ log }) {
  return (
    <ol className="log">
      {log.map(({ player, result }) => {
        const subject = player === 'player' ? 'You' : 'Opponent';
        const verb = result === 'miss' ? 'missed' : 'hit';
        return <li>{`${subject} shot . . . and ${verb}!`}</li>;
      })}
    </ol>
  );
}

export default AttackLog;
