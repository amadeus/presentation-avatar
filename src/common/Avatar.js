// @flow strict

import * as React from 'react';
import classNames from 'classnames';
import {animated, useSpring} from 'react-spring';
import {v4} from 'uuid';

import {
  Sizes,
  getAvatarSpecs,
  getAvatarSize,
  CUTOUT_BORDER_RADIUS,
  MOBILE_HEIGHT_RATIO,
  TYPING_WIDTH_RATIO,
  type SizeSpec,
} from './Constants';
import Dots from './Dots';
import {renderStatusMask, getStatusValues, getStatusColor, type AnimationValues} from './Status';

import {StatusTypes} from './Constants';
import styles from './Avatar.module.css';

export {Sizes};

type StatusValues = $Values<typeof StatusTypes>;
type SizesValues = $Values<typeof Sizes>;

const SPRING_CONFIG = {
  tension: 1200,
  friction: 70,
};

type RenderWrapperProps = {|
  children: React.Node,
  size: SizesValues,
  className?: ?string,
  tabIndex?: number,
  isMobile: boolean,
  status: ?StatusValues,
|};

function renderWrapper({children, size, className, tabIndex, status, isMobile}: RenderWrapperProps): React.Node {
  const style = {
    width: getAvatarSize(size),
    height: getAvatarSize(size),
  };
  return (
    <div className={classNames(className, styles.wrapper)} style={style} role="img">
      {children}
    </div>
  );
}

function getCutoutValues({size, status, stroke, offset}: SizeSpec, isMobile: boolean, isTyping: boolean) {
  const width = isTyping ? status * TYPING_WIDTH_RATIO : status;
  const xOffset = (width - status) / 2;
  const height = isMobile ? status * MOBILE_HEIGHT_RATIO : status;
  return {
    avatarCutoutX: size - width + xOffset - stroke - offset,
    avatarCutoutY: size - height - stroke - offset,
    avatarCutoutWidth: width + stroke * 2,
    avatarCutoutHeight: height + stroke * 2,
    avatarCutoutRadius: isMobile ? (height + stroke * 2) * CUTOUT_BORDER_RADIUS : (status + stroke * 2) / 2,
  };
}

type AnimatedProps = {|
  status: StatusValues,
  isMobile: boolean,
  isTyping: boolean,
  size: SizesValues,
|};

type AnimatedValues = {|
  ...AnimationValues,
  avatarCutoutX: number,
  avatarCutoutY: number,
  avatarCutoutWidth: number,
  avatarCutoutHeight: number,
  avatarCutoutRadius: number,
|};

function getAnimatedValues(
  {status, isMobile, isTyping, size}: AnimatedProps,
  disableStatusIcons: boolean
): AnimatedValues {
  const statusOverride = disableStatusIcons ? StatusTypes.ONLINE : status;
  const isMobileOnline = isMobile && !isTyping && status === StatusTypes.ONLINE;
  const specs = getAvatarSpecs(size);
  return {
    ...getCutoutValues(specs, isMobileOnline, isTyping),
    ...getStatusValues({
      status: statusOverride,
      size: specs.status,
      isMobile: isMobileOnline,
      isTyping,
      topOffset: 2,
      leftOffset: 6,
    }),
  };
}

type AnimatedAvatarComponentProps = {|
  src: ?string,
  size: SizesValues,
  isMobile?: boolean,
  status?: ?StatusValues,
  statusColor?: ?string,
  isTyping?: boolean,
  className?: ?string,
  statusTooltip?: boolean,
  tabIndex?: number,
  disableStatusIcons?: boolean,

  status: StatusValues,
  statusTooltip?: boolean,
  isTyping?: boolean,
  fromStatus: StatusValues,
  fromIsMobile: boolean,
  fromColor: string,
|};

const Avatar = (props: AnimatedAvatarComponentProps) => {
  const {
    className,
    fromIsMobile = true,
    fromStatus,
    fromColor,
    isMobile = false,
    isTyping = false,
    size,
    src,
    status,
    statusColor,
    statusTooltip = false,
    disableStatusIcons = false,
    tabIndex,
  } = props;
  const [{avatarMask, statusIconMask, fromSpecs}] = React.useState(() => ({
    avatarMask: v4(),
    statusIconMask: v4(),
    fromSpecs: {
      fill: fromColor,
      ...getAnimatedValues({size, status: fromStatus, isMobile: fromIsMobile, isTyping: false}, disableStatusIcons),
    },
  }));
  const toSpecs = React.useMemo(
    () => ({
      fill: statusColor == null ? getStatusColor(status) : statusColor,
      ...getAnimatedValues({size, status, isMobile, isTyping}, disableStatusIcons),
    }),
    [size, status, isMobile, isTyping, disableStatusIcons, statusColor]
  );
  const {
    avatarCutoutX,
    avatarCutoutY,
    avatarCutoutWidth,
    avatarCutoutHeight,
    avatarCutoutRadius,
    fill,
    ...animatedProps
  } = useSpring({
    config: SPRING_CONFIG,
    from: fromSpecs,
    to: toSpecs,
  });
  const avatarSize = getAvatarSize(size);
  const specs = getAvatarSpecs(size);
  const width = specs.status * TYPING_WIDTH_RATIO;
  const height = specs.status * MOBILE_HEIGHT_RATIO;
  const typingOffset = (specs.status * TYPING_WIDTH_RATIO - specs.status) / 2;
  const x = specs.size - specs.status - typingOffset - specs.offset;
  const y = specs.size - height - specs.offset;
  const children = (
    <svg
      width={specs.size + Math.ceil(typingOffset)}
      height={specs.size}
      viewBox={`0 0 ${specs.size + Math.ceil(typingOffset)} ${specs.size}`}
      className={styles.mask}
      aria-hidden>
      <mask id={avatarMask} width={avatarSize} height={avatarSize}>
        <circle cx={avatarSize / 2} cy={avatarSize / 2} r={avatarSize / 2} fill="white" />
        <animated.rect
          color="black"
          x={avatarCutoutX}
          y={avatarCutoutY}
          width={avatarCutoutWidth}
          height={avatarCutoutHeight}
          rx={avatarCutoutRadius}
          ry={avatarCutoutRadius}
        />
      </mask>
      <foreignObject x={0} y={0} width={avatarSize} height={avatarSize} mask={`url(#${avatarMask})`}>
        <img
          src={src}
          // We need this empty space here so if the image fails to load, the
          // psuedo elements we generate in CSS will exist and be our fallback styles
          // in Firefox
          alt=" "
          className={styles.avatar}
          aria-hidden
        />
      </foreignObject>
      <svg
        x={x}
        y={y}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={statusTooltip ? styles.cursorDefault : null}>
        {renderStatusMask(animatedProps, specs.status, statusIconMask)}
        <animated.rect fill={fill} width={width} height={height} mask={`url(#${statusIconMask})`} />
        <Dots dotRadius={specs.status / 4} x={width * 0.15} y={height * 0.5} hide={!isTyping} />
      </svg>
    </svg>
  );
  return renderWrapper({
    children,
    size,
    className,
    tabIndex,
    isMobile,
    status,
  });
};

export default Avatar;
