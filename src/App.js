// @flow strict
import React, {useState, useEffect} from 'react';
import Animations from './pages/Animations';
import StatusGrid from './pages/StatusGrid';
import AvatarGrid from './pages/AvatarGrid';

type PageKeysType = {|
  ANIMATIONS: 'ANIMATIONS',
  GRID_STATUS: 'GRID_STATUS',
  GRID_AVATAR: 'GRID_AVATAR',
|};

const PageKeys: PageKeysType = Object.freeze({
  ANIMATIONS: 'ANIMATIONS',
  GRID_STATUS: 'GRID_STATUS',
  GRID_AVATAR: 'GRID_AVATAR',
});

const Pages: Array<$Values<PageKeysType>> = Object.keys(PageKeys).map(key => PageKeys[key]);

function App() {
  const [page, setPage] = useState<$Values<PageKeysType>>(() => PageKeys.ANIMATIONS);
  useEffect(() => {
    const handleKeypress = (event: KeyboardEvent) => {
      event.key === ' ' &&
        setPage(page => {
          const index = Pages.indexOf(page);
          if (event.shiftKey) {
            return Pages[index - 1] || Pages[Pages.length - 1];
          } else {
            return Pages[index + 1] || Pages[0];
          }
        });
    };
    document.addEventListener('keypress', handleKeypress);
    return () => void document.removeEventListener('keypress', handleKeypress);
  }, []);

  switch (page) {
    case PageKeys.ANIMATIONS:
      return <Animations />;
    case PageKeys.GRID_STATUS:
      return <StatusGrid />;
    case PageKeys.GRID_AVATAR:
      return <AvatarGrid />;
    default:
      throw new Error('App.render: Invalid page...');
  }
}

export default App;
