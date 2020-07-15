// @flow strict
import React, {useEffect, useRef} from 'react';
import {animated, useSpring} from 'react-spring';
import ColorWrapper from '../common/ColorWrapper';
import styles from './AnimationBasic.module.css';

const RANGE = 100;
const MAIN_COLOR = '#ffffff';
const VELOCITY = RANGE / 1000;
const INTERVAL_INCREMENT_DELAY = 3000;
const FPS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60];

const AnimationBasic = () => {
  const ref = useRef(null);
  const [props, setValues] = useSpring(() => ({
    immediate: true,
    backgroundColor: MAIN_COLOR,
    left: `${50 - RANGE / 2}%`,
  }));

  useEffect(() => {
    let fps = 0;
    let left = 50 - RANGE / 2;
    let interval = 1000 / 5;
    let intervalTimer = 0;
    let prevIter = null;
    let prev = 0;
    let lastFPS = null;

    const animate = now => {
      const {current} = ref;
      if (current != null) {
        const _fps = Math.round(1000 / interval);
        if (_fps !== lastFPS) {
          current.innerHTML = `${_fps}`;
          lastFPS = _fps;
        }
      }
      if (prevIter == null) {
        prevIter = now;
        prev = now;
        requestAnimationFrame(animate);
        return;
      }
      const diff = now - prevIter;
      intervalTimer += now - prev;
      if (diff > interval) {
        const distance = VELOCITY * diff;
        left += distance;
        if (left >= 50 + RANGE / 2) {
          left = 50 - RANGE / 2 + left - (50 + RANGE / 2);
        }
        setValues({
          left: `${left}%`,
          immediate: true,
        });
        prevIter = now;
      }
      if (intervalTimer > INTERVAL_INCREMENT_DELAY && fps < FPS.length - 1) {
        intervalTimer = 0;
        fps += 1;
        interval = Math.max(1000 / 60, 1000 / FPS[fps]);
      }
      prev = now;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [setValues]);

  return (
    <ColorWrapper opacity={0.4}>
      <code ref={ref} className={styles.fps} />
      <animated.div className={styles.circle} style={props} />
    </ColorWrapper>
  );
};

export default AnimationBasic;
