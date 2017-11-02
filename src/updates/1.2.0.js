/* @flow */
declare var chrome: any
import type { AppState } from '../types'

module.exports = (state: AppState) => {
  if (
    state.proxyUrl ===
    'https://wt-e9c9a7a436fcd9273a7f8890849dae65-0.run.webtask.io/bandwidth-hero-proxy'
  ) {
    state.proxyUrl = 'https://compressor.bandwidth-hero.com'
    chrome.storage.local.set(state)
  }
}
