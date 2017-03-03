import React, { PropTypes, Component } from 'react'
import injectSheet from 'react-jss'
import Button from './components/button'
import prejss from 'prejss'

const styles = (classname) => prejss`
  $bg-default: #ccc;
  @global {
    body {
      color: $bg-default;
    }
    ${classname} {
      color: ${color => color};
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