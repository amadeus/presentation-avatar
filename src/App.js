// @flow strict
import React, {useState, useEffect} from 'react';
import Status, {getStatusColor} from './Status';
import Avatar, {Sizes} from './Avatar';
import {animated, useSpring} from 'react-spring';
import {StatusTypes} from './Constants';
import styles from './App.module.css';

const STATUSES: any = Object.values(StatusTypes);

type GridProps = {|
  status: any,
  isMobile: boolean,
  isTyping: boolean,
|};

const SPRING_CONFIG = {
  tension: 1200,
  friction: 70,
};

function StatusGrid({status, isMobile}: GridProps) {
  return (
    <>
      {new Array(15).fill(null).map((_, index) => (
        <Status key={index} status={status} size={128} isMobile={isMobile} />
      ))}
    </>
  );
}

function AvatarGrid({status, isMobile, isTyping}: GridProps) {
  return (
    <>
      {new Array(15).fill(null).map((_, index) => (
        <Avatar
          key={index}
          fromStatus={status}
          fromIsMobile={isMobile}
          fromColor={getStatusColor(status)}
          src=""
          status={status}
          size={Sizes.SIZE_128}
          isMobile={isMobile}
          isTyping={isTyping}
        />
      ))}
    </>
  );
}

function App() {
  const [status, setStatus] = useState(StatusTypes.ONLINE);
  const [isMobile, setMobile] = useState(false);
  const [isTyping, setTyping] = useState(false);
  const [statusMode, setMode] = useState(true);
  useEffect(() => {
    const handleKeypress = (event: KeyboardEvent) => {
      switch (event.key) {
        case '1':
        case '2':
        case '3':
        case '4': {
          const statusIndex = parseInt(event.key, 10) - 1;
          setStatus(STATUSES[statusIndex]);
          break;
        }
        case 'm':
          setMobile(isMobile => !isMobile);
          break;
        case 't':
          setTyping(isTyping => !isTyping);
          break;
        case ' ':
          setMode(v => !v);
          return;
        default:
          console.log(event);
          return;
      }
    };
    document.addEventListener('keypress', handleKeypress);
    return () => {
      document.removeEventListener('keypress', handleKeypress);
    };
  }, []);
  const style = useSpring({
    config: SPRING_CONFIG,
    to: {
      backgroundColor: getStatusColor(status),
    },
  });
  return (
    <>
      <animated.div className={styles.bg} style={style} />
      {statusMode ? (
        <StatusGrid status={status} isMobile={isMobile} isTyping={isTyping} />
      ) : (
        <AvatarGrid status={status} isMobile={isMobile} isTyping={isTyping} />
      )}
    </>
  );
}

export default App;
