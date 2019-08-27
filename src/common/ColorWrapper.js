// @flow strict
import React, {useEffect, type Node} from 'react';
import {useSpring, animated} from 'react-spring';
import styles from './ColorWrapper.module.css';

const {innerWidth, innerHeight} = window;
const WINDOW_MAX = innerWidth + innerHeight;

function getHSLAFromXY(x: number, y: number, opacity: number): string {
  const percentage = (x + y) / WINDOW_MAX;
  return `hsla(${Math.floor(358 * percentage)}, 100%, 50%, ${opacity})`;
}

type ColorWrapperProps = {|
  opacity?: number,
  children: Node,
|};

function ColorWrapper({children, opacity = 0.2}: ColorWrapperProps) {
  const [style, updateSpring] = useSpring(() => ({backgroundColor: getHSLAFromXY(0, 0, opacity)}));
  useEffect(() => {
    const handleMouseMove = ({pageX, pageY}: MouseEvent) =>
      updateSpring({backgroundColor: getHSLAFromXY(pageX, pageY, opacity)});
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [updateSpring, opacity]);
  return (
    <animated.div style={style} className={styles.container}>
      {children}
    </animated.div>
  );
}

export default ColorWrapper;
