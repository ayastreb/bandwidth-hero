/* global chrome */
import defaultState from './defaults'

chrome.storage.sync.get(storedState => {
  let state = { ...defaultState, ...storedState }
  chrome.extension.onMessage.addListener(newState => (state = newState))

  if (!state.enabled) {
    chrome.browserAction.setIcon({ path: 'assets/icon-128-disabled.png' })
  }
})
