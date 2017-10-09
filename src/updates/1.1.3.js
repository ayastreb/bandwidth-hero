/* @flow */
declare var chrome: any
import type { AppState } from '../types'

module.exports = (state: AppState) => {
  if (!state.disabledHosts) {
    state.disabledHosts = state.whitelist
    chrome.storage.local.set(state)
  }
}
