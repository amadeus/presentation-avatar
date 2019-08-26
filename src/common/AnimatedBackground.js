// @flow strict
import React from 'react';
import {animated, useSpring} from 'react-spring';
import {getStatusColor} from './Status';
import {typeof StatusTypes} from './Constants';
import styles from './AnimatedBackground.module.css';

type AnimatedBackgroundProps = {|status: $Values<StatusTypes>|};

const SPRING_CONFIG = {
  tension: 1200,
  friction: 70,
};
function AnimatedBackground({status}: AnimatedBackgroundProps) {
  const style = useSpring({
    config: SPRING_CONFIG,
    to: {backgroundColor: getStatusColor(status)},
  });
  return <animated.div className={styles.bg} style={style} />;
}

export default AnimatedBackground;
