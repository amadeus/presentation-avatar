// @flow strict
import React, {useEffect} from 'react';
import {animated, useSpring} from 'react-spring';
import ColorWrapper from '../common/ColorWrapper';
import styles from './AnimationBasic.module.css';

const RANGE = 30;
const FRAMES = 4;
const MAIN_COLOR = '#ffffff';

function animate(setValues: any, i: number) {
  let interval = i;
  const left = 50 - RANGE / 2;
  const inc = RANGE / (FRAMES * 2);
  new Array(FRAMES * 2 + 1).fill(null).forEach((_, index) => {
    setTimeout(() => {
      setValues({
        left: `${left + inc * index}%`,
      });
    }, interval * index);
  });
  setTimeout(() => {
    animate(setValues, interval);
  }, interval * FRAMES * 2 + 2);
  if (interval > 1000 / 60) {
    interval = Math.max(1000 / 60, (interval -= 50));
  }
}

const AnimationBasic = () => {
  const [props, setValues] = useSpring(() => ({
    immediate: true,
    backgroundColor: MAIN_COLOR,
    left: '40%',
  }));

  useEffect(() => {
    animate(setValues, 300);
  }, [setValues]);

  return (
    <ColorWrapper opacity={0.4}>
      <animated.div className={styles.circle} style={props} />
    </ColorWrapper>
  );
};

export default AnimationBasic;
