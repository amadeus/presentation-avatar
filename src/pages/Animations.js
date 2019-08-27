// @flow strict
import React, {useState, useEffect, useRef, type Node} from 'react';
import classNames from 'classnames';
import {useSpring, animated} from 'react-spring';
import ColorWrapper from '../common/ColorWrapper';
import styles from './Animations.module.css';

const FOLLOW_Y_OFFSET = 36;
const FOLLOW_X_OFFSET = 4;

function quadInOut(T) {
  let t = T;
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}

const {innerWidth, innerHeight} = window;

type LineProps = {|
  title: Node,
  config: {...},
|};

function Line({title, config}: LineProps) {
  const [toggle, setToggle] = useState(false);
  const props = useSpring({
    config,
    x: toggle ? 552 : 0,
    z: 0,
  });
  return (
    <div className={styles.tweenExample} onClick={() => setToggle(b => !b)}>
      <h3>{title}</h3>
      <div className={styles.line}>
        <animated.div className={styles.dot} style={props} />
      </div>
    </div>
  );
}

function Box() {
  const [toggle, setToggle] = useState(false);
  const boxStyles = useSpring({
    config: {
      tension: 200,
      friction: 18,
      clamp: true,
    },
    borderRadius: toggle ? '50%' : '10%',
  });

  return (
    <div className={styles.tweenExample} onClick={() => setToggle(b => !b)}>
      <h3>Morph Spring Example</h3>
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

type FollowMouseProps = {|
  spring: boolean,
|};

function FollowMouse({spring}: FollowMouseProps) {
  const ref = useRef();
  const [props, updateSpring] = useSpring(() => ({x: innerWidth / 2, y: innerHeight / 2}));
  useEffect(() => {
    const update = (x: number, y: number) => {
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
      const {current} = ref;
      if (current != null) {
        current.innerHTML = `x: ${String(x).padEnd(4, ' ')} y: ${String(y).padEnd(4, ' ')}`;
      }
    };
    const handleMouseMove = ({pageX, pageY}: MouseEvent) => update(pageX, pageY);
    document.addEventListener('mousemove', handleMouseMove);
    update(innerWidth / 2, innerHeight / 2);
    return () => void document.removeEventListener('mousemove', handleMouseMove);
  }, [spring, updateSpring]);
  return (
    <>
      <button ref={ref} className={classNames(styles.button, styles.xy, styles.cell)} />
      <animated.div className={styles.chaser} style={props} />
    </>
  );
}

function MouseChaser() {
  const [followMouse, setFollow] = useState(false);
  const [spring, setSpring] = useState(false);
  return (
    <>
      <div className={styles.mouseChaser}>
        <button
          className={classNames({
            [styles.button]: true,
            [styles.cell]: true,
            [styles.selected]: followMouse,
          })}
          onClick={() =>
            setFollow(followMouse => {
              if (followMouse) {
                setSpring(false);
                return false;
              }
              return true;
            })
          }>
          Mouse Chaser
        </button>
        <button
          className={classNames({
            [styles.button]: true,
            [styles.cell]: true,
            [styles.selected]: spring,
          })}
          onClick={() => setSpring(b => !b)}>
          {spring ? 'Spring Mode' : 'Tween Mode'}
        </button>
        {followMouse ? <FollowMouse spring={spring} /> : null}
      </div>
    </>
  );
}

function Animations() {
  return (
    <ColorWrapper>
      <Line
        title="Linear Example"
        config={{
          duration: 1000,
          tension: 100,
          friction: 20,
        }}
      />
      <Line
        title="Tween Example"
        config={{
          easing: quadInOut,
          duration: 1000,
          tension: 100,
          friction: 20,
        }}
      />
      <Line
        title="Spring Example"
        config={{
          tension: 75,
          friction: 20,
        }}
      />
      <Box />
      <MouseChaser />
    </ColorWrapper>
  );
}

export default Animations;
