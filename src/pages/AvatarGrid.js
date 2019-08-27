// @flow strict
import React from 'react';
import Avatar, {Sizes} from '../common/Avatar';
import {getStatusColor} from '../common/Status';
import AnimatedBackground from '../common/AnimatedBackground';
import Grid from '../common/Grid';
import useStatusKeyboard from '../hooks/useStatusKeyboard';

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
  const {status, isMobile, isTyping} = useStatusKeyboard();
  return (
    <Grid>
      <AnimatedBackground status={status} />
      {AVATARS.map(src => (
        <Avatar
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
    </Grid>
  );
}

export default AvatarGrid;
