/* @flow */
declare var chrome: any
import React from 'react'
import Header from './components/Header'
import UsageStatistic from './components/UsageStatistic'
import WhitelistButton from './components/WhitelistButton'
import SettingsAccordion from './components/SettingsAccordion'
import Footer from './components/Footer'
import defaults from '../defaults'

type popupState = {
  enabled: boolean,
  statistics: {
    filesProcessed: number,
    bytesSaved: number
  },
  whitelist: string[],
  proxyUrl: string
}

class Popup extends React.Component {
  state: popupState

  constructor(props: popupState) {
    super(props)
    this.state = props
  }

  enableSwitchClicked = () => {
    chrome.browserAction.setIcon({
      path: !this.state.enabled
        ? 'assets/icon-128.png'
        : 'assets/icon-128-disabled.png'
    })
    this.setState(
      prevState => ({ enabled: !prevState.enabled }),
      this.stateWasUpdated
    )
  }

  proxyUrlChanged = (e: Event, { value }: { value: string }) => {
    this.setState(prevState => ({ proxyUrl: value }), this.stateWasUpdated)
  }

  proxyUrlWasReset = () => {
    this.setState(
      prevState => ({ proxyUrl: defaults.proxyUrl }),
      this.stateWasUpdated
    )
  }

  stateWasUpdated = () => {
    chrome.storage.sync.set(this.state)
    chrome.extension.sendMessage(this.state)
  }

  render() {
    const { enabled, statistics, whitelist, proxyUrl } = this.state
    return (
      <div>
        <Header enabled={enabled} onChange={this.enableSwitchClicked} />
        <UsageStatistic
          filesProcessed={statistics.filesProcessed}
          bytesSaved={statistics.bytesSaved}
        />
        <WhitelistButton />
        <SettingsAccordion
          whitelist={whitelist}
          proxyUrl={proxyUrl}
          proxyUrlOnChange={this.proxyUrlChanged}
          proxyUrlOnReset={this.proxyUrlWasReset}
        />
        <Footer />
      </div>
    )
  }
}

export default Popup
