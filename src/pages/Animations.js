// @flow strict
import React, {useState, useEffect, type Node} from 'react';
import classNames from 'classnames';
import {useSpring, animated} from 'react-spring';
import styles from './Animations.module.css';

const FOLLOW_Y_OFFSET = 36;
const FOLLOW_X_OFFSET = 4;

function quadInOut(T) {
  let t = T;
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}

const {innerWidth, innerHeight} = window;
const WINDOW_MAX = innerWidth + innerHeight;

type LineProps = {|
  spring: boolean,
|};

function Line({spring}: LineProps) {
  const [toggle, setToggle] = useState(false);
  const props = useSpring({
    config: {
      ...(spring
        ? null
        : {
            easing: quadInOut,
            duration: 500,
          }),
      tension: 100,
      friction: 20,
    },
    x: toggle ? 552 : 0,
    z: 0,
  });
  return (
    <div className={styles.tweenExample} onClick={() => setToggle(b => !b)}>
      <h3>Movement Example</h3>
      <div className={styles.line}>
        <animated.div className={styles.dot} style={props} />
      </div>
    </div>
  );
}

type FollowMouseProps = {|
  spring: boolean,
|};

function FollowMouse({spring}: FollowMouseProps) {
  const [props, updateSpring] = useSpring(() => ({x: innerWidth / 2, y: innerHeight / 2}));
  useEffect(() => {
    const handleMouseMove = ({pageX: x, pageY: y}: MouseEvent) => {
      updateSpring({
        config: {
          tension: 260,
          friction: 15,
          mass: 3,
          ...(spring
            ? null
            : {
                easing: quadInOut,
                duration: 500,
              }),
        },
        x: x + FOLLOW_X_OFFSET,
        y: y + FOLLOW_Y_OFFSET,
      });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => void document.removeEventListener('mousemove', handleMouseMove);
  }, [spring, updateSpring]);
  return <animated.div className={styles.item} style={props} />;
}

function getHSLAFromXY(x: number, y: number): string {
  const percentage = (x + y) / WINDOW_MAX;
  return `hsla(${Math.floor(358 * percentage)}, 100%, 50%, 0.2)`;
}

type ColorWrapperProps = {|
  children: Node,
|};

function ColorWrapper({children}: ColorWrapperProps) {
  const [style, updateSpring] = useSpring(() => ({backgroundColor: getHSLAFromXY(0, 0)}));
  useEffect(() => {
    const handleMouseMove = ({pageX, pageY}: MouseEvent) =>
      updateSpring({backgroundColor: getHSLAFromXY(pageX, pageY)});
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [updateSpring]);
  return (
    <animated.div style={style} className={styles.container}>
      {children}
    </animated.div>
  );
}

type BoxProps = {|
  spring: boolean,
|};

function Box({spring}: BoxProps) {
  const [toggle, setToggle] = useState(false);
  const boxStyles = useSpring({
    config: {
      ...(spring
        ? null
        : {
            easing: quadInOut,
            duration: 270,
          }),
      tension: 200,
      friction: 18,
      clamp: true,
    },
    borderRadius: toggle ? '50%' : '10%',
  });

  return (
    <div className={styles.tweenExample} onClick={() => setToggle(b => !b)}>
      <h3>Morph Example</h3>
      <div className={styles.row}>
        <animated.div style={boxStyles} className={styles.box} />
        <animated.div style={boxStyles} className={styles.box} />
        <animated.div style={boxStyles} className={styles.box} />
        <animated.div style={boxStyles} className={styles.box} />
        <animated.div style={boxStyles} className={styles.box} />
      </div>
    </div>
  );
}

function Animations() {
  const [followMouse, setFollow] = useState(false);
  const [spring, setSpring] = useState(false);
  return (
    <ColorWrapper>
      <div className={styles.buttons}>
        <button className={classNames(styles.button, {[styles.selected]: spring})} onClick={() => setSpring(b => !b)}>
          {spring ? 'Spring Mode' : 'Tween Mode'}
        </button>
        <button
          className={classNames(styles.button, {[styles.selected]: followMouse})}
          onClick={() => setFollow(b => !b)}>
          Mouse Chaser
        </button>
      </div>
      <Line spring={spring} />
      <Box spring={spring} />
      {followMouse ? <FollowMouse spring={spring} /> : null}
    </ColorWrapper>
  );
}

export default Animations;
