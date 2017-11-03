// @flow
declare var chrome: any
import shouldCompress from './background/shouldCompress'
import patchContentSecurity from './background/patchContentSecurity'
import getHeaderValue from './background/getHeaderIntValue'
import parseUrl from './utils/parseUrl'
import deferredStateStorage from './utils/deferredStateStorage'
import defaultState from './defaults'
import type { AppState } from './types'

chrome.storage.local.get((storedState: AppState) => {
  const storage = deferredStateStorage()
  let state: AppState
  let pageUrl: string
  let isWebpSupported

  setState({ ...defaultState, ...storedState })

  checkWebpSupport().then(isSupported => {
    isWebpSupported = isSupported
  })

  async function checkWebpSupport() {
    if (!self.createImageBitmap) return false

    const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
    const blob = await fetch(webpData).then(r => r.blob())
    return self.createImageBitmap(blob).then(() => true, () => false)
  }

  /**
   * Sync state.
   */
  function setState(newState: AppState) {
    if (chrome.browserAction.setIcon && (!state || state.enabled !== newState.enabled)) {
      chrome.browserAction.setIcon({
        path: newState.enabled ? 'assets/icon-128.png' : 'assets/icon-128-disabled.png'
      })
    }
    state = newState
  }

  /**
   * Intercept image loading request and decide if we need to compress it.
   */
  function onBeforeRequestListener({ url }) {
    if (
      shouldCompress({
        imageUrl: url,
        pageUrl,
        proxyUrl: state.proxyUrl,
        disabledHosts: state.disabledHosts,
        enabled: state.enabled
      })
    ) {
      // TODO: remove after all migrated to custom domain
      if (
        state.proxyUrl ===
        'https://wt-e9c9a7a436fcd9273a7f8890849dae65-0.run.webtask.io/bandwidth-hero-proxy'
      ) {
        state.proxyUrl = 'https://compressor.bandwidth-hero.com'
      }
      let redirectUrl = `${state.proxyUrl}?url=${encodeURIComponent(url)}`
      if (!isWebpSupported) redirectUrl += '&jpeg=1'
      if (!state.convertBw) redirectUrl += '&bw=0'
      if (state.compressionLevel) {
        redirectUrl += '&l=' + parseInt(state.compressionLevel, 10)
      }

      return { redirectUrl }
    }
  }

  /**
   * Retrieve saved bytes info from response headers, update statistics in
   * app storage and notify UI about state changes.
   */
  function onCompletedListener({ responseHeaders }) {
    const bytesSaved = getHeaderValue(responseHeaders, 'x-bytes-saved')
    const bytesProcessed = getHeaderValue(responseHeaders, 'x-original-size')
    if (bytesSaved !== false && bytesProcessed !== false) {
      state.statistics.filesProcessed += 1
      state.statistics.bytesProcessed += bytesProcessed
      state.statistics.bytesSaved += bytesSaved

      storage.set(state)
      chrome.runtime.sendMessage(state)
    }
  }

  /**
   * Patch document's content security policy headers so that it will allow
   * images loading from our compression proxy URL.
   */
  function onHeadersReceivedListener({ responseHeaders }) {
    return {
      responseHeaders: patchContentSecurity(responseHeaders, state.proxyUrl)
    }
  }

  chrome.runtime.onMessage.addListener(setState)
  chrome.webRequest.onBeforeRequest.addListener(
    onBeforeRequestListener,
    {
      urls: ['<all_urls>'],
      types: ['image']
    },
    ['blocking']
  )
  chrome.webRequest.onCompleted.addListener(
    onCompletedListener,
    {
      urls: ['<all_urls>'],
      types: ['image']
    },
    ['responseHeaders']
  )
  chrome.webRequest.onHeadersReceived.addListener(
    onHeadersReceivedListener,
    {
      urls: ['<all_urls>'],
      types: ['main_frame', 'sub_frame']
    },
    ['blocking', 'responseHeaders']
  )
  chrome.tabs.onActivated.addListener(({ tabId }) => {
    chrome.tabs.get(tabId, tab => (pageUrl = parseUrl(tab.url).hostname))
  })
})
