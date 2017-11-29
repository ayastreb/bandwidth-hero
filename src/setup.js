import React from 'react'
import ReactDOM from 'react-dom'
import Setup from './setup/'
import defaultState from './defaults'
import 'semantic-ui-css/semantic.css'
import './index.css'

chrome.storage.local.get(storedState => {
  const initialState = { ...defaultState, ...storedState }

  ReactDOM.render(<Setup {...initialState} />, document.getElementById('root'))
})
