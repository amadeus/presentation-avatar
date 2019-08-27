// @flow strict
import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import './index.css';
import App from './App';

const el = document.getElementById('root');
el != null &&
  ReactDOM.render(
    <>
      <Helmet>
        <title>Building The New Avatar</title>
      </Helmet>
      <App />
    </>,
    el
  );
