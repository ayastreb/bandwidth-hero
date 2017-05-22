chrome.runtime.onInstalled.addListener(
  ({
    reason,
    previousVersion
  }: {
    reason: string,
    previousVersion: string
  }) => {
    if (reason === 'update') {
      chrome.storage.sync.get((storedState: AppState) => {
        require(`./updates/${previousVersion}.js`)(storedState)
      })
    }
  }
)
