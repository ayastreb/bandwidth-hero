/* global chrome */
'use strict'

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(runPopup)

  function runPopup(settings) {
    const enabledSwitch = document.getElementById('bh-enabled')
    const serverUrlInp = document.getElementById('bh-server_url')
    const updateButton = document.getElementById('bh-update')
    const successMsg = document.getElementById('bh-success')

    if (settings.enabled && !enabledSwitch.checked) {
      enabledSwitch.click()
    }
    serverUrlInp.value = settings.serverUrl
    serverUrlInp.parentNode.classList.add('is-dirty')

    enabledSwitch.addEventListener('change', handleEnabledSwitch)
    updateButton.addEventListener('click', handleSettingsUpdate)
    return

    function handleEnabledSwitch() {
      chrome.storage.sync.set({ enabled: enabledSwitch.checked })
      chrome.extension.sendMessage({
        action: enabledSwitch.checked ? 'enable' : 'disable'
      })
    }

    function handleSettingsUpdate() {
      if (
        settings.serverUrl !== serverUrlInp.value &&
        serverUrlInp.value.length
      ) {
        chrome.storage.sync.set({
          serverUrl: serverUrlInp.value
        })
        successMsg.style.display = 'block'
      }
    }
  }
})
