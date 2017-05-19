// @flow
declare var chrome: any
import shouldCompress from './background/shouldCompress'
import patchContentSecurity from './background/patchContentSecurity'
import getSavedBytes from './background/getSavedBytes'
import defaultState from './defaults'
import type { AppState } from './types'

chrome.storage.sync.get((storedState: AppState) => {
  let state: AppState
  setState({ ...defaultState, ...storedState })

  /**
   * Sync state.
   */
  function setState(newState: AppState) {
    if (!state || state.enabled !== newState.enabled) {
      chrome.browserAction.setIcon({
        path: newState.enabled
          ? 'assets/icon-128.png'
          : 'assets/icon-128-disabled.png'
      })
    }
    state = newState
  }

  /**
   * Intercept image loading request and decide if we need to compress it.
   */
  function onBeforeRequestListener({ url }) {
    if (shouldCompress(url, state)) {
      return { redirectUrl: `${state.proxyUrl}?url=${encodeURIComponent(url)}` }
    }
  }

  /**
   * Retrieve saved bytes info from response headers, update statistics in
   * app storage and notify UI about state changes.
   */
  function onCompletedListener({ responseHeaders }) {
    const bytesSaved = getSavedBytes(responseHeaders)
    if (bytesSaved !== false) {
      state.statistics.filesProcessed += 1
      state.statistics.bytesSaved += bytesSaved

      chrome.storage.sync.set(state)
      chrome.extension.sendMessage(state)
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

  chrome.extension.onMessage.addListener(setState)
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
})
