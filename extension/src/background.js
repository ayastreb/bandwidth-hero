/* global chrome */
'use strict'

const defaults = {
  enabled: true,
  serverUrl: 'https://wt-e9c9a7a436fcd9273a7f8890849dae65-0.run.webtask.io/bandwidth-hero-webtask'
}

/**
 * Set default settings when extension is installed.
 */
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.storage.sync.set(defaults)
  } else if (details.reason === 'update') {
    chrome.storage.sync.get(settings => {
      // Replace old WebSocket server URL with HTTPS
      if (settings.serverUrl.indexOf('wss:') !== -1) {
        chrome.storage.sync.set({
          serverUrl: defaults.serverUrl
        })
      }
      if (settings.serverUrl.indexOf('herokuapp.com:') !== -1) {
        chrome.storage.sync.set({
          serverUrl: `${settings.serverUrl}compress`
        })
      }
    })
  }
})

chrome.storage.sync.get(runBackground)

function runBackground (settings) {
  settings = Object.assign({}, defaults, settings)
  let enabled = settings.enabled

  if (!enabled) {
    chrome.browserAction.setIcon({ path: 'res/images/icon-128-disabled.png' })
  }

  chrome.extension.onMessage.addListener(handleMessage)
  chrome.webRequest.onBeforeRequest.addListener(redirectImagesToProxy,
    {
      urls: [ '<all_urls>' ],
      types: [ 'image' ]
    },
    [ 'blocking' ]
  )
  chrome.webRequest.onHeadersReceived.addListener(patchContentSecurityPolicy,
    {
      urls: [ '<all_urls>' ],
      types: [ 'main_frame', 'sub_frame' ]
    },
    [ 'blocking', 'responseHeaders' ]
  )

  /**
   * Handle incoming messages from extension/popup.
   *
   * @param Object request
   */
  function handleMessage (request) {
    const actionHandlers = {
      'setActiveIcon': () => {
        chrome.browserAction.setIcon({
          path: 'res/images/icon-128-active.png'
        })
      },
      'setDefaultIcon': () => {
        chrome.browserAction.setIcon({
          path: 'res/images/icon-128.png'
        })
      },
      'enable': () => {
        enabled = true
        chrome.browserAction.setIcon({
          path: 'res/images/icon-128.png'
        })
      },
      'disable': () => {
        enabled = false
        chrome.browserAction.setIcon({
          path: 'res/images/icon-128-disabled.png'
        })
      }
    }

    if (request.action in actionHandlers) {
      actionHandlers[ request.action ]()
    }
  }

  /**
   * Redirect images to compression proxy.
   *
   * @param Object details
   * @returns Object object
   */
  function redirectImagesToProxy (details) {
    const allowPatterns = [
      settings.serverUrl,
      'favicon',
      '.*.svg'
    ]
    if (enabled && !details.url.match(RegExp(`(${allowPatterns.join('|')})`, 'i')) &&
      details.url.match(/https?:\/\/.+/i)) {
      return {
        redirectUrl: `${settings.serverUrl}?url=${encodeURIComponent(details.url)}`
      }
    }
  }

  /**
   * Patch Content-Security-Policy header to allow compressed images loading.
   *
   * @param Object details
   * @returns Object patched headers
   */
  function patchContentSecurityPolicy (details) {
    for (let i = 0; i < details.responseHeaders.length; i++) {
      if (/content-security-policy/i.test(details.responseHeaders[ i ].name)) {
        details.responseHeaders[ i ].value = details
          .responseHeaders[ i ]
          .value
          .replace('img-src', `img-src ${settings.serverUrl}`)
      }
    }

    return {
      responseHeaders: details.responseHeaders
    }
  }
}
