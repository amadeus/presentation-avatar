// @flow strict
import React, {useEffect} from 'react';
import {animated, useSpring} from 'react-spring';
import styles from './AnimationBasic.module.css';

const RANGE = 30;
const FRAMES = 8;
let INTERVAL = 400;
const MAIN_COLOR = 'rgba(0, 0, 0, 1)';
const ALT_COLOR = '#ffffff';

function bgFlash(setValues) {
  const left = 50 - RANGE / 2;
  const inc = RANGE / (FRAMES * 2);
  new Array(FRAMES * 2).fill(null).forEach((_, index) => {
    const type = index % 2;
    if (type === 0) {
      setTimeout(() => {
        setValues({
          backgroundColor: ALT_COLOR,
        });
      }, INTERVAL * index);
    } else {
      setTimeout(() => {
        setValues({
          left: `${left + inc * index}%`,
          backgroundColor: MAIN_COLOR,
        });
      }, INTERVAL * index);
    }
  });
  setTimeout(() => {
    bgFlash(setValues);
  }, INTERVAL * FRAMES * 2);
  if (INTERVAL > 1000 / 60) {
    INTERVAL = Math.max(1000 / 60, (INTERVAL -= 200));
  }
}

const AnimationBasic = () => {
  const [props, setValues] = useSpring(() => ({
    immediate: true,
    backgroundColor: MAIN_COLOR,
    left: '40%',
  }));

  useEffect(() => {
    bgFlash(setValues);
  }, [setValues]);

  return (
    <div className={styles.bg}>
      <animated.div className={styles.circle} style={props} />
    </div>
  );
};

export default AnimationBasic;
