// @flow strict
import React, {type Node} from 'react';
import styles from './Grid.module.css';

type GridProps = {|
  children: Node,
|};

function Grid({children}: GridProps) {
  return <div className={styles.grid}>{children}</div>;
}

export default Grid;
