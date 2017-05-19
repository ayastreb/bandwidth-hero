/* @flow */
declare var chrome: any
import React from 'react'
import Header from './components/Header'
import UsageStatistic from './components/UsageStatistic'
import WhitelistButton from './components/WhitelistButton'
import SettingsAccordion from './components/SettingsAccordion'
import Footer from './components/Footer'
import parseUrl from '../utils/parseUrl'
import defaults from '../defaults'
import type { AppState, AppProps } from '../types'

export default class Popup extends React.Component {
  state: AppState
  props: AppProps

  constructor(props: AppProps) {
    super(props)
    this.state = {
      enabled: props.enabled,
      statistics: props.statistics,
      whitelist: props.whitelist,
      proxyUrl: props.proxyUrl
    }

    chrome.extension.onMessage.addListener(this.stateWasUpdatedFromBackground)
  }

  enableSwitchWasChanged = () => {
    this.setState(
      prevState => ({ enabled: !prevState.enabled }),
      this.stateWasUpdatedFromUI
    )
  }

  siteWasAddedToWhitelist = () => {
    const { hostname } = parseUrl(this.props.currentUrl)
    this.setState(
      prevState => ({
        whitelist: prevState.whitelist.concat(hostname)
      }),
      this.stateWasUpdatedFromUI
    )
  }

  siteWasRemovedFromWhitelist = () => {
    const { hostname } = parseUrl(this.props.currentUrl)
    this.setState(
      prevState => ({
        whitelist: prevState.whitelist.filter(site => site !== hostname)
      }),
      this.stateWasUpdatedFromUI
    )
  }

  whitelistWasChanged = (_: Event, { value }: { value: string }) => {
    this.setState(
      prevState => ({ whitelist: value.split('\n') }),
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
        <WhitelistButton
          whitelist={whitelist}
          currentUrl={this.props.currentUrl}
          onAddToWhitelist={this.siteWasAddedToWhitelist}
          onRemoveFromWhitelist={this.siteWasRemovedFromWhitelist}
        />
        <SettingsAccordion
          whitelist={whitelist}
          whitelistOnChange={this.whitelistWasChanged}
          proxyUrl={proxyUrl}
          proxyUrlOnChange={this.proxyUrlWasChanged}
          proxyUrlOnReset={this.proxyUrlWasReset}
        />
        <Footer />
      </div>
    )
  }
}
