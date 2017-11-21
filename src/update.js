chrome.runtime.onInstalled.addListener(({ reason, previousVersion }) => {
  if (reason === 'update') {
    chrome.storage.local.get(storedState => {
      try {
        require(`./updates/${previousVersion}.js`)(storedState)
      } catch (e) {}
    })
  }
})
