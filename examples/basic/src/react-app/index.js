import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

const rootElement = document.getElementById('root')

ReactDOM.render(App, rootElement, () => {
  // Styles rehydrate
  const ssStyles = document.getElementById('server-side-styles')
  ssStyles.parentNode.removeChild(ssStyles)
})
