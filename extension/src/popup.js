'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const enabledSwitch = document.getElementById('bh_enabled');
    const serverUrlInp  = document.getElementById('bh_server_url');

    chrome.storage.sync.get(options => {
        if (options.enabled && !enabledSwitch.checked) {
            enabledSwitch.click();
        }
        serverUrlInp.value = options.serverUrl;
    });

    enabledSwitch.addEventListener('change', () => {
        chrome.storage.sync.set({enabled: enabledSwitch.checked});
        chrome.extension.sendMessage({
            action: enabledSwitch.checked ? 'enable' : 'disable'
        });
    });
});
