import React from 'react'
import ReactDOM from 'react-dom'
import App from './popup/App'
import 'semantic-ui-css/semantic.css'
import './popup/index.css'

const defaults = {
  enabled: true,
  statistics: {
    filesProcessed: 0,
    bytesSaved: 0
  },
  whitelist: [],
  proxyUrl: 'https://wt-e9c9a7a436fcd9273a7f8890849dae65-0.run.webtask.io/bandwidth-hero-webtask'
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(settings => {
    const storedState = { ...settings, ...defaults }
    ReactDOM.render(
      <App
        enabled={storedState.enabled}
        statistics={storedState.statistics}
        whitelist={storedState.whitelist}
        proxyUrl={storedState.proxyUrl}
      />,
      document.getElementById('root')
    )
  })
})
