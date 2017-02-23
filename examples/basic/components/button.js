import React from 'react'
import injectSheet from 'react-jss'
import fromPostCSS from '../../../src/index';

const styles = ({selector}) => fromPostCSS`
  ${selector} {
    font: 400 18px/1.4 Roboto, Helvetica, Arial, sans-serif;
    display: inline-block;
    border-radius: 3px;
    background: linear-gradient(to bottom, #ffce44, #ffc12f);
    box-shadow: 0 2px 2px rgba(0, 0, 0, .3);
    text-transform: uppercase;
    color: #161617;
    outline: none;
    cursor: pointer;
    font-weight: 500;
    border-radius: 5px;
    width: 300px;
    height: 50px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  label {
    color: white;
  }
`

const Button = ({ classes, children }) => (
  <button className={classes.button}>
    <span className={classes.label}>
      Don't press me
    </span>
  </button>
)

export default injectSheet(styles({selector: 'button'}))(Button)