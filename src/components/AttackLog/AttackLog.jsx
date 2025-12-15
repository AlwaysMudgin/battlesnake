import React from 'react';

function AttackLog({ log }) {
  const lastRef = React.useRef();

  const scroll = [...log];

  React.useEffect(() => {
    lastRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [scroll]);

  return (
    <ol className="log">
      {log.map(({ player, result }, index, arr) => {
        const subject = player === 'player' ? 'You' : 'Opponent';
        const verb = result === 'miss' ? 'missed' : 'hit';
        const ref = index === arr.length - 1 ? lastRef : null;
        return <li ref={ref}>{`${subject} shot . . . and ${verb}!`}</li>;
      })}
    </ol>
  );
}

export default AttackLog;
