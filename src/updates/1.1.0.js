/* @flow */
declare var chrome: any
import type { AppState } from '../types'

module.exports = (state: AppState) => {
  if (!state.statistics.bytesProcessed) {
    state.statistics.bytesProcessed = state.statistics.bytesSaved
    chrome.storage.local.set(state)
  }
}
