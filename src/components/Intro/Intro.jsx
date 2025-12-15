import React from 'react';
import styles from './Intro.module.css';
import snakeImg from '../../assets/images/viper.svg';

function Intro({ phase, startSetup }) {
  return (
    <div
      className={`${styles.container} ${phase === 'intro' ? styles.intro : ''}`}
    >
      <div className={styles.content}>
        <img
          className={`${styles.image} ${phase === 'intro' ? styles.intro : ''}`}
          src={snakeImg}
          alt=""
        />
        <button
          className={`${styles.button} ${
            phase === 'intro' ? styles.intro : ''
          }`}
          onClick={startSetup}
        >
          Don't fear nothing
        </button>
        <h1
          className={`${styles.battle} ${
            phase === 'intro' ? styles.intro : ''
          }`}
          onClick={startSetup}
        >
          BattleSnake
        </h1>
      </div>
    </div>
  );
}

export default Intro;
