// @flow
import React from 'react'
import Header from './components/Header'
import UsageStatistic from './components/UsageStatistic'
import WhitelistButton from './components/WhitelistButton'
import SettingsAccordion from './components/SettingsAccordion'
import Footer from './components/Footer'

type appState = {
  enabled: boolean,
  statistics: {
    filesProcessed: number,
    bytesSaved: number
  },
  whitelist: string[],
  proxyUrl: string
}

class App extends React.Component {
  state: appState

  constructor(props: appState) {
    super(props)
    this.state = props
  }

  render() {
    const { enabled, statistics, whitelist, proxyUrl } = this.state
    return (
      <div>
        <Header enabled={enabled} />
        <UsageStatistic
          filesProcessed={statistics.filesProcessed}
          bytesSaved={statistics.bytesSaved}
        />
        <WhitelistButton />
        <SettingsAccordion whitelist={whitelist} proxyUrl={proxyUrl} />
        <Footer />
      </div>
    )
  }
}

export default App
