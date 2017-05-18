/* global chrome */
import React from 'react'
import ReactDOM from 'react-dom'
import Popup from './popup/Popup'
import defaultState from './defaults'
import 'semantic-ui-css/semantic.css'
import './popup/index.css'

chrome.storage.sync.get(storedState => {
  const popupState = { ...defaultState, ...storedState }
  ReactDOM.render(
    <Popup
      enabled={popupState.enabled}
      statistics={popupState.statistics}
      whitelist={popupState.whitelist}
      proxyUrl={popupState.proxyUrl}
    />,
    document.getElementById('root')
  )
})
