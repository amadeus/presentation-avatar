// @flow strict
import {useState, useEffect} from 'react';
import {StatusTypes} from '../common/Constants';

type StatusType = $Values<typeof StatusTypes>;

const STATUSES: Array<$Values<typeof StatusTypes>> = (Object.values(StatusTypes): any);

type StatusKeyboardHook = {|
  status: StatusType,
  isMobile: boolean,
  isTyping: boolean,
|};

function useStatusKeyboard(): StatusKeyboardHook {
  const [status, setStatus] = useState(StatusTypes.ONLINE);
  const [isMobile, setMobile] = useState(false);
  const [isTyping, setTyping] = useState(false);

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

  return {status, isTyping, isMobile};
}

export default useStatusKeyboard;
