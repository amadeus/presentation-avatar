// @flow strict
import React from 'react';
import Status from '../common/Status';
import AnimatedBackground from '../common/AnimatedBackground';
import useStatusKeyboard from '../hooks/useStatusKeyboard';

function StatusGrid() {
  const {status, isMobile} = useStatusKeyboard();
  return (
    <>
      <AnimatedBackground status={status} />
      {new Array(15).fill(null).map((_, index) => (
        <Status key={index} status={status} size={128} isMobile={isMobile} />
      ))}
    </>
  );
}

export default StatusGrid;
