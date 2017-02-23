import React, { PropTypes, Component } from 'react';
import injectSheet from 'react-jss'
import Button from './components/button';

import fromPostCSS from '../../src/index'

const styles = fromPostCSS`
  $bg-default: #ccc;
  @global {
    body {
      color: $bg-default;
    }
    button {
      color: #888888;
    }
  }
`

const App = ({ classes }) => {
  return (
    <div>
      <Button />
    </div>
  )
};

export default injectSheet(styles)(App)