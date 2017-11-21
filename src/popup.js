import React from 'react'
import ReactDOM from 'react-dom'
import Popup from './popup/Popup'
import defaultState from './defaults'
import 'semantic-ui-css/semantic.css'
import './popup/index.css'

chrome.storage.local.get(storedState => {
  const initialState = { ...defaultState, ...storedState }

  chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
    const [activeTab] = tabs
    ReactDOM.render(
      <Popup currentUrl={activeTab.url} {...initialState} />,
      document.getElementById('root')
    )
  })
})
