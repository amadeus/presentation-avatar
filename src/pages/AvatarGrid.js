// @flow strict
import React from 'react';
import classNames from 'classnames';
import Avatar, {Sizes} from '../common/Avatar';
import {animated, useSpring} from 'react-spring';
import {getStatusColor} from '../common/Status';
import AnimatedBackground from '../common/AnimatedBackground';
import Grid from '../common/Grid';
import {StatusTypes} from '../common/Constants';
import useStatusKeyboard from '../hooks/useStatusKeyboard';
import Status from '../common/Status';

import avatar01 from '../assets/avatar01.png';
import avatar02 from '../assets/avatar02.png';
import avatar03 from '../assets/avatar03.png';
import avatar04 from '../assets/avatar04.png';
import avatar05 from '../assets/avatar05.png';
import avatar06 from '../assets/avatar06.png';
import avatar07 from '../assets/avatar07.png';
import avatar08 from '../assets/avatar08.png';
import avatar09 from '../assets/avatar09.png';
import avatar10 from '../assets/avatar10.png';
import avatar11 from '../assets/avatar11.png';
import avatar12 from '../assets/avatar12.png';
import avatar13 from '../assets/avatar13.png';
import avatar14 from '../assets/avatar14.png';
import avatar15 from '../assets/avatar15.png';

import styles from './AvatarGrid.module.css';
import keyStyles from './KeyStyles.module.css';

type StatusType = $Values<typeof StatusTypes>;

const SPRING_CONFIG = {
  tension: 600,
  friction: 70,
};

function getPositionForStatus(status: StatusType) {
  switch (status) {
    case StatusTypes.ONLINE:
      return {y: 0};
    case StatusTypes.IDLE:
      return {y: 24};
    case StatusTypes.DND:
      return {y: 48};
    case StatusTypes.OFFLINE:
    default:
      return {y: 72};
  }
}

type KeyProps = {|
  status: StatusType,
  isMobile: boolean,
  isTyping: boolean,
  setStatus: any,
  setMobile: any,
  setTyping: any,
|};

function Key({status, isMobile, isTyping, setStatus, setMobile, setTyping}: KeyProps) {
  const [showSettings, setShowSettings] = React.useState(true);
  const props = useSpring({
    config: SPRING_CONFIG,
    to: getPositionForStatus(status),
  });
  return (
    <div
      className={classNames({
        [keyStyles.wrapper]: true,
        [keyStyles.modeOnline]: status === StatusTypes.ONLINE,
        [keyStyles.modeIdle]: status === StatusTypes.IDLE,
        [keyStyles.modeDnd]: status === StatusTypes.DND,
        [keyStyles.modeOffline]: status === StatusTypes.OFFLINE,
      })}>
      <h1 className={keyStyles.title} onClick={() => setShowSettings(b => !b)}>
        <span>Settings</span>
        <span className={classNames({[keyStyles.expand]: true, [keyStyles.plus]: !showSettings})} />
      </h1>
      {showSettings && (
        <>
          <animated.div style={props} className={keyStyles.selection}>
            <Status className={keyStyles.statusIcon} size={18} status={status} />
          </animated.div>
          <ul className={keyStyles.statuses}>
            <li
              className={classNames({[keyStyles.status]: true, [keyStyles.selected]: status === StatusTypes.ONLINE})}
              onClick={() => setStatus(StatusTypes.ONLINE)}>
              <code>1</code>
              <span>Online</span>
            </li>
            <li
              className={classNames({[keyStyles.status]: true, [keyStyles.selected]: status === StatusTypes.IDLE})}
              onClick={() => setStatus(StatusTypes.IDLE)}>
              <code>2</code>
              <span>Idle</span>
            </li>
            <li
              className={classNames({[keyStyles.status]: true, [keyStyles.selected]: status === StatusTypes.DND})}
              onClick={() => setStatus(StatusTypes.DND)}>
              <code>3</code>
              <span>DnD</span>
            </li>
            <li
              className={classNames({[keyStyles.status]: true, [keyStyles.selected]: status === StatusTypes.OFFLINE})}
              onClick={() => setStatus(StatusTypes.OFFLINE)}>
              <code>4</code>
              <span>Offline</span>
            </li>
          </ul>
          <ul className={keyStyles.modifiers}>
            <li
              className={classNames({[keyStyles.status]: true, [keyStyles.selected]: isMobile})}
              onClick={() => setMobile(b => !b)}>
              <code>m</code>
              <span>
                Mobile <small>(online only)</small>
              </span>
              <div className={classNames({[keyStyles.fakeCheck]: true, [keyStyles.fakeCheckChecked]: isMobile})} />
            </li>
            <li
              className={classNames({[keyStyles.status]: true, [keyStyles.selected]: isTyping})}
              onClick={() => setTyping(b => !b)}>
              <code>t</code>
              <span>Typing</span>
              <div className={classNames({[keyStyles.fakeCheck]: true, [keyStyles.fakeCheckChecked]: isTyping})} />
            </li>
          </ul>
        </>
      )}
    </div>
  );
}

const AVATARS = [
  avatar01,
  avatar02,
  avatar03,
  avatar04,
  avatar05,
  avatar06,
  avatar07,
  avatar08,
  avatar09,
  avatar10,
  avatar11,
  avatar12,
  avatar13,
  avatar14,
  avatar15,
];

function AvatarGrid() {
  const props = useStatusKeyboard();
  const {status, isMobile, isTyping} = props;
  return (
    <Grid>
      <AnimatedBackground status={status} />
      {AVATARS.map(src => (
        <Avatar
          className={styles.avatar}
          key={src}
          fromStatus={status}
          fromIsMobile={isMobile}
          fromColor={getStatusColor(status)}
          src={src}
          status={status}
          size={Sizes.SIZE_128}
          isMobile={isMobile}
          isTyping={isTyping}
        />
      ))}
      <Key {...props} />
    </Grid>
  );
}

export default AvatarGrid;
