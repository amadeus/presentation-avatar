// @flow strict
import * as React from 'react';
import classNames from 'classnames';
import {animated, useSpring} from 'react-spring';
import uuid from 'uuid';
import {MOBILE_HEIGHT_RATIO, TYPING_WIDTH_RATIO, MOBILE_ICON_RADIUS, StatusTypes, Colors} from './Constants';
import styles from './Status.module.css';

const SIZE = 8;
const SPRING_CONFIG = {
  tension: 600,
  friction: 70,
};

export {StatusTypes};

export function getStatusColor(status: ?$Values<typeof StatusTypes>): $Values<typeof Colors> {
  switch (status) {
    case StatusTypes.ONLINE:
      return Colors.STATUS_GREEN;
    case StatusTypes.IDLE:
      return Colors.STATUS_YELLOW;
    case StatusTypes.DND:
      return Colors.STATUS_RED;
    case StatusTypes.OFFLINE:
    default:
      return Colors.STATUS_GREY;
  }
}

export type StatusValuesProps = {|
  size: number,
  status: $Values<typeof StatusTypes>,
  isMobile: boolean,
  isTyping?: boolean,
  leftOffset?: number,
  topOffset?: number,
|};

export type AnimationValues = {|
  bgRadius: number,
  bgY: number,
  bgX: number,
  bgHeight: number,
  bgWidth: number,
  cutoutX: number,
  cutoutY: number,
  cutoutWidth: number,
  cutoutHeight: number,
  cutoutRadius: number,
  dotY: number,
  dotX: number,
  dotRadius: number,
|};

export function getStatusValues({
  size,
  status,
  isMobile,
  isTyping,
  topOffset = 0,
  leftOffset = 0,
}: StatusValuesProps): AnimationValues {
  const _topOffset = (topOffset / SIZE) * size;
  const _leftOffset = (leftOffset / SIZE) * size;
  if (isTyping) {
    return {
      bgRadius: 0.5 * size,
      bgY: 0.25 * size + _topOffset,
      bgX: 0,
      bgHeight: size,
      bgWidth: size * TYPING_WIDTH_RATIO,
      cutoutX: 0.5 * size + _leftOffset,
      cutoutY: 0.75 * size + _topOffset,
      cutoutWidth: 0,
      cutoutHeight: 0,
      cutoutRadius: 0,
      dotY: 0.75 * size + _topOffset,
      dotX: 0.5 * size + _leftOffset,
      dotRadius: 0,
    };
  }
  switch (status) {
    case StatusTypes.ONLINE:
      if (isMobile) {
        return {
          bgRadius: size * MOBILE_HEIGHT_RATIO * MOBILE_ICON_RADIUS,
          bgY: 0,
          bgX: _leftOffset,
          bgHeight: size * MOBILE_HEIGHT_RATIO,
          bgWidth: size,
          cutoutX: 0.125 * size + _leftOffset,
          cutoutY: 0.25 * size,
          cutoutWidth: 0.75 * size,
          cutoutHeight: 0.75 * size,
          cutoutRadius: 0,
          dotY: 1.25 * size,
          dotX: 0.5 * size + _leftOffset,
          dotRadius: 0.125 * size,
        };
      } else {
        return {
          bgRadius: 0.5 * size,
          bgY: 0.25 * size + _topOffset,
          bgX: _leftOffset,
          bgHeight: size,
          bgWidth: size,
          cutoutX: 0.5 * size + _leftOffset,
          cutoutY: 0.75 * size + _topOffset,
          cutoutWidth: 0,
          cutoutHeight: 0,
          cutoutRadius: 0,
          dotY: 0.75 * size + _topOffset,
          dotX: 0.5 * size + _leftOffset,
          dotRadius: 0,
        };
      }
    case StatusTypes.IDLE:
      return {
        bgRadius: 0.5 * size,
        bgY: 0.25 * size + _topOffset,
        bgX: _leftOffset,
        bgHeight: size,
        bgWidth: size,
        cutoutX: -(0.125 * size) + _leftOffset,
        cutoutY: 0.125 * size + _topOffset,
        cutoutWidth: 0.75 * size,
        cutoutHeight: 0.75 * size,
        cutoutRadius: 0.375 * size,
        dotY: 0.75 * size + _topOffset,
        dotX: 0.5 * size + _leftOffset,
        dotRadius: 0,
      };
    case StatusTypes.DND:
      return {
        bgRadius: 0.5 * size,
        bgY: 0.25 * size + _topOffset,
        bgX: _leftOffset,
        bgHeight: size,
        bgWidth: size,
        cutoutX: 0.125 * size + _leftOffset,
        cutoutY: 0.625 * size + _topOffset,
        cutoutWidth: 0.75 * size,
        cutoutHeight: 0.25 * size,
        cutoutRadius: 0.125 * size,
        dotY: 0.75 * size + _topOffset,
        dotX: 0.5 * size + _leftOffset,
        dotRadius: 0,
      };
    case StatusTypes.OFFLINE:
    default:
      return {
        bgRadius: 0.5 * size,
        bgY: 0.25 * size + _topOffset,
        bgX: _leftOffset,
        bgHeight: size,
        bgWidth: size,
        cutoutX: 0.25 * size + _leftOffset,
        cutoutY: 0.5 * size + _topOffset,
        cutoutWidth: 0.5 * size,
        cutoutHeight: 0.5 * size,
        cutoutRadius: 0.25 * size,
        dotY: 0.75 * size + _topOffset,
        dotX: 0.5 * size + _leftOffset,
        dotRadius: 0,
      };
  }
}

export function renderStatusMask(
  {
    bgRadius,
    bgY,
    bgX,
    bgHeight,
    bgWidth,
    cutoutX,
    cutoutY,
    cutoutWidth,
    cutoutHeight,
    cutoutRadius,
    dotY,
    dotX,
    dotRadius,
  }: any,
  size: number,
  maskId: string
): React.Node {
  return (
    <mask id={maskId}>
      <animated.rect x={bgX} y={bgY} width={bgWidth} height={bgHeight} rx={bgRadius} ry={bgRadius} fill="white" />
      <animated.rect
        x={cutoutX}
        y={cutoutY}
        width={cutoutWidth}
        height={cutoutHeight}
        rx={cutoutRadius}
        ry={cutoutRadius}
        fill="black"
      />
      <animated.circle fill="black" cx={dotX} cy={dotY} r={dotRadius} />
    </mask>
  );
}

type StatusProps = {|
  className?: ?string,
  color?: ?string,
  isMobile?: boolean,
  size?: number,
  // status: $Values<typeof StatusTypes>,
  status: any,
  style?: ?{...},
|};

const AnimatedStatus = ({status, isMobile = false, size = SIZE, color, className, style}: StatusProps) => {
  const [maskId] = React.useState(() => uuid.v4());
  const isMobileOnline = status === StatusTypes.ONLINE && isMobile;
  const to = React.useMemo(() => getStatusValues({size, status, isMobile: isMobileOnline}), [
    size,
    status,
    isMobileOnline,
  ]);
  const props = useSpring({config: SPRING_CONFIG, to});
  const computedColor = color == null ? getStatusColor(status) : color;
  const [{fill}] = useSpring({config: SPRING_CONFIG, fill: computedColor}, [computedColor]);
  const width = size;
  const height = Math.ceil(size * MOBILE_HEIGHT_RATIO);
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={classNames(styles.mask, className)}
      style={style}>
      {renderStatusMask(props, size, maskId)}
      <animated.rect x={0} y={0} width={width} height={height} fill={fill} mask={`url(#${maskId})`} />
    </svg>
  );
};

export default AnimatedStatus;
