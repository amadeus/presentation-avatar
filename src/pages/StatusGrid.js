// @flow strict
import React from 'react';
import Status from '../common/Status';
import AnimatedBackground from '../common/AnimatedBackground';
import Grid from '../common/Grid';
import useStatusKeyboard from '../hooks/useStatusKeyboard';

function StatusGrid() {
  const {status, isMobile} = useStatusKeyboard();
  return (
    <Grid>
      <AnimatedBackground status={status} />
      {new Array(15).fill(null).map((_, index) => (
        <Status key={index} status={status} size={128} isMobile={isMobile} />
      ))}
    </Grid>
  );
}

export default StatusGrid;
