'use strict';

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(runPopup);

    function runPopup(settings) {
        const enabledSwitch = document.getElementById('bh-enabled');
        const serverUrlInp  = document.getElementById('bh-server_url');
        const updateButton  = document.getElementById('bh-update');
        const loadingSpin   = document.getElementById('bh-spinner');
        const successMsg    = document.getElementById('bh-success');
        const errorMsg      = document.getElementById('bh-error');

        if (settings.enabled && !enabledSwitch.checked) {
            enabledSwitch.click();
        }
        serverUrlInp.value = settings.serverUrl;
        serverUrlInp.parentNode.classList.add('is-dirty');

        enabledSwitch.addEventListener('change', handleEnabledSwitch);
        updateButton.addEventListener('click', handleSettingsUpdate);
        return;

        function handleEnabledSwitch() {
            chrome.storage.sync.set({enabled: enabledSwitch.checked});
            chrome.extension.sendMessage({
                action: enabledSwitch.checked ? 'enable' : 'disable'
            });
        }

        function handleSettingsUpdate() {
            if (settings.serverUrl != serverUrlInp.value) {
                if (serverUrlInp.value.length) {
                    loadingSpin.classList.add('is-active');

                    const ws   = new WebSocket(serverUrlInp.value);
                    ws.onerror = () => {
                        loadingSpin.classList.remove('is-active');
                        errorMsg.style.display   = 'block';
                        successMsg.style.display = 'none';
                    }
                    ws.onopen  = () => {
                        loadingSpin.classList.remove('is-active');
                        chrome.storage.sync.set({
                            serverUrl: serverUrlInp.value
                        });
                        errorMsg.style.display   = 'none';
                        successMsg.style.display = 'block';
                        ws.close();
                    }
                }
            }
        }
    }
});
