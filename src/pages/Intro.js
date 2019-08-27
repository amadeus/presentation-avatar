// @flow strict
import React from 'react';
import ColorWrapper from '../common/ColorWrapper';
import styles from './Intro.module.css';

function Intro() {
  return (
    <ColorWrapper>
      <h1 className={styles.title}>animations</h1>
      <h2 className={styles.subtitle}>how do they work</h2>
    </ColorWrapper>
  );
}

export default Intro;
