export default (delay = 1000) => {
  let pendingState = null
  let timerId

  return {
    set(state) {
      if (pendingState === null) {
        timerId = window.setTimeout(() => {
          chrome.storage.local.set(pendingState, () => {
            window.clearTimeout(timerId)
            pendingState = null
          })
        }, delay)
      }

      pendingState = state
    }
  }
}
