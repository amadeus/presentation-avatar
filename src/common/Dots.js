// @flow strict
import * as React from 'react';
import {animated, useSpring, useTransition} from 'react-spring';

import styles from './Dots.module.css';

function wait() {
  return new Promise(resolve => setTimeout(resolve, 1000));
}

function hasFocus() {
  return process.env.NODE_ENV === 'development' || document.hasFocus();
}

const TIMING_OFFSET = 0.25;
const DURATION = 600;
const CYCLE = 4;
const CYCLES = 1;
const CYCLE_OFFSET = 2.8;
const TRANSITION_PROPS = {
  config: {
    friction: 50,
    tension: 900,
    mass: 1,
  },
  unique: true,
  initial: {dotPosition: 1},
  from: {dotPosition: 0},
  enter: {dotPosition: 1},
  leave: {dotPosition: 0},
};
const SPRING_PROPS = {
  config: {duration: CYCLES * CYCLE * DURATION},
  from: {dotCycle: CYCLE_OFFSET},
  reset: true,
};

// Ensure all values interpolate up and down between 0 and 1
function interpolateLoop(value: number) {
  const moddedValue = value % 2;
  if (moddedValue > 1) {
    return 1 - (moddedValue - 1);
  }
  return moddedValue;
}

type AnimatedDotsProps = {|
  dotRadius: number,
  dotPosition: any,
|};

const AnimatedDots = React.memo<AnimatedDotsProps>(({dotRadius, dotPosition}) => {
  // We need this ref to break into the while iteration and cancel it
  const focused = React.useRef(hasFocus());
  const mounted = React.useRef(true);
  React.useEffect(() => () => void (mounted.current = false), []);
  const [{dotCycle}] = useSpring(() => ({
    ...SPRING_PROPS,
    to: async next => {
      let cycleStatus = CYCLE_OFFSET;
      // eslint-disable-next-line no-unmodified-loop-condition
      while (true) {
        // The component can get unmounted while waiting - so kill the loop if
        // unmounted
        if (!mounted.current) {
          break;
        }
        focused.current = hasFocus();
        if (!focused.current) {
          // Reset the animation so when/if we resume it feels right
          if (cycleStatus !== CYCLE_OFFSET) {
            cycleStatus = CYCLE_OFFSET;
            // If we call this await again when it's already at the value,
            // this loop seems to get cancelled. So only set it if
            // cycleStatus is different
            await next({dotCycle: cycleStatus, immediate: true});
          } else {
            // Otherwise wait a second before looping
            await wait();
          }
        } else {
          cycleStatus += CYCLES * CYCLE;
          await next({dotCycle: cycleStatus, immediate: false});
        }
      }
    },
  }));

  const centerPosition = (dotRadius * 2 * 3 + (dotRadius / 4) * 2) / 2;
  return [0, 1, 2].map(key => {
    const timingOffset = TIMING_OFFSET * key;
    const position = dotRadius + key * (dotRadius * 2.5);
    return (
      <animated.circle
        key={key}
        cx={dotPosition.to([0, 1], [centerPosition, position])}
        cy={dotRadius}
        r={dotCycle
          .to(value => interpolateLoop(value - timingOffset))
          .to([0, 0.4, 0.8, 1], [dotRadius * 0.8, dotRadius * 0.8, dotRadius, dotRadius])
          .to(value => (focused.current ? value : dotRadius))}
        fill="white"
        style={{
          opacity: dotCycle
            .to(value => interpolateLoop(value - timingOffset))
            .to([0, 0.4, 0.8, 1], [0.3, 0.3, 1, 1])
            .to(value => (focused.current ? value : 1)),
        }}
      />
    );
  });
});

type DotsProps = {|
  dotRadius: number,
  x?: number,
  y?: number,
  hide?: boolean,
|};

const Dots = React.memo<DotsProps>(({dotRadius, x, y, hide = false}) => {
  const transition = useTransition(hide, {
    ...TRANSITION_PROPS,
    keys: v => (v ? 'true' : 'false'),
    immediate: !hasFocus(),
  });
  return transition(({dotPosition}, item) => {
    return !item ? (
      <svg x={x} y={y} width={dotRadius * 2 * 3 + (dotRadius / 2) * 2} height={dotRadius * 2} className={styles.dots}>
        <animated.g style={{opacity: dotPosition.to(value => Math.min(1, Math.max(value, 0)))}}>
          <AnimatedDots dotRadius={dotRadius} dotPosition={dotPosition} />
        </animated.g>
      </svg>
    ) : null;
  });
});

export default Dots;
