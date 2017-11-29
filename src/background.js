import shouldCompress from './background/shouldCompress'
import patchContentSecurity from './background/patchContentSecurity'
import getHeaderValue from './background/getHeaderIntValue'
import parseUrl from './utils/parseUrl'
import deferredStateStorage from './utils/deferredStateStorage'
import defaultState from './defaults'
import axios from 'axios'

chrome.storage.local.get(storedState => {
  const storage = deferredStateStorage()
  let setupOpen
  let state
  let pageUrl
  let compressed
  let isWebpSupported

  if (/compressor\.bandwidth-hero\.com/i.test(storedState.proxyUrl)) {
    chrome.storage.local.set({ ...storedState, proxyUrl: '' })
  }

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
  function setState(newState) {
    if (chrome.browserAction.setIcon && (!state || state.enabled !== newState.enabled)) {
      chrome.browserAction.setIcon({
        path: newState.enabled ? 'assets/icon-128.png' : 'assets/icon-128-disabled.png'
      })
    }
    state = newState
  }

  function checkSetup() {
    if (
      !setupOpen &&
      state.enabled &&
      (state.proxyUrl === '' || /compressor\.bandwidth-hero\.com/i.test(state.proxyUrl))
    ) {
      chrome.tabs.create({ url: 'setup.html' })
      setupOpen = true
    }
  }

  /**
   * Intercept image loading request and decide if we need to compress it.
   */
  function onBeforeRequestListener({ url }) {
    checkSetup()
    if (
      shouldCompress({
        imageUrl: url,
        pageUrl,
        compressed,
        proxyUrl: state.proxyUrl,
        disabledHosts: state.disabledHosts,
        enabled: state.enabled
      })
    ) {
      compressed.add(url)
      let redirectUrl = `${state.proxyUrl}?url=${encodeURIComponent(url)}`
      if (!isWebpSupported) redirectUrl += '&jpeg=1'
      if (!state.convertBw) redirectUrl += '&bw=0'
      if (state.compressionLevel) {
        redirectUrl += '&l=' + parseInt(state.compressionLevel, 10)
      }
      if (!isFirefox()) return { redirectUrl }
      // Firefox allows onBeforeRequest event listener to return a Promise
      // and perform redirect when this Promise is resolved.
      // This allows us to run HEAD request before redirecting to compression
      // to make sure that the image should be compressed.
      return axios.head(url).then(res => {
        if (
          res.status === 200 &&
          res.headers['content-length'] > 1024 &&
          res.headers['content-type'] &&
          res.headers['content-type'].startsWith('image')
        ) {
          return { redirectUrl }
        }
      })
    }
  }

  /**
   * Firefox user agent always has "rv:" and "Gecko"
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent/Firefox
   */
  function isFirefox() {
    return /rv\:.*Gecko/.test(window.navigator.userAgent)
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
  chrome.tabs.onUpdated.addListener(() => (compressed = new Set()))
  chrome.runtime.onInstalled.addListener(checkSetup)
})
