/* @flow */
declare var chrome: any
import React from 'react'
import Header from './components/Header'
import UsageStatistic from './components/UsageStatistic'
import WhitelistButton from './components/WhitelistButton'
import SettingsAccordion from './components/SettingsAccordion'
import Footer from './components/Footer'
import defaults from '../defaults'
import type { AppState } from '../types'

export default class Popup extends React.Component {
  state: AppState

  constructor(initialProps: AppState) {
    super(initialProps)
    this.state = initialProps

    chrome.extension.onMessage.addListener(this.stateWasUpdatedFromBackground)
  }

  enableSwitchWasChanged = () => {
    this.setState(
      prevState => ({ enabled: !prevState.enabled }),
      this.stateWasUpdatedFromUI
    )
  }

  proxyUrlWasChanged = (_: Event, { value }: { value: string }) => {
    this.setState(
      prevState => ({ proxyUrl: value }),
      this.stateWasUpdatedFromUI
    )
  }

  proxyUrlWasReset = () => {
    this.setState(
      prevState => ({ proxyUrl: defaults.proxyUrl }),
      this.stateWasUpdatedFromUI
    )
  }

  /**
   * Sync every UI state change with local storage and background process.
   */
  stateWasUpdatedFromUI = () => {
    chrome.storage.sync.set(this.state)
    chrome.extension.sendMessage(this.state)
  }

  /**
   * Receive state changes from background process and update UI.
   */
  stateWasUpdatedFromBackground = (newState: AppState) => {
    this.setState(newState)
  }

  render() {
    const { enabled, statistics, whitelist, proxyUrl } = this.state
    return (
      <div>
        <Header enabled={enabled} onChange={this.enableSwitchWasChanged} />
        <UsageStatistic
          filesProcessed={statistics.filesProcessed}
          bytesSaved={statistics.bytesSaved}
        />
        <WhitelistButton />
        <SettingsAccordion
          whitelist={whitelist}
          proxyUrl={proxyUrl}
          proxyUrlOnChange={this.proxyUrlWasChanged}
          proxyUrlOnReset={this.proxyUrlWasReset}
        />
        <Footer />
      </div>
    )
  }
}
