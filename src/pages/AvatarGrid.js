// @flow strict
import React from 'react';
import Avatar, {Sizes} from '../common/Avatar';
import {getStatusColor} from '../common/Status';
import AnimatedBackground from '../common/AnimatedBackground';
import useStatusKeyboard from '../hooks/useStatusKeyboard';

function AvatarGrid() {
  const {status, isMobile, isTyping} = useStatusKeyboard();
  return (
    <>
      <AnimatedBackground status={status} />
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

export default AvatarGrid;
