// @flow
declare var chrome: any
import type { AppState } from '../types'

export default (delay: number = 1000) => {
  let pendingState: null | AppState = null
  let timerId: number

  return {
    set(state: AppState) {
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
