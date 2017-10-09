/* @flow */
declare var chrome: any
import React from 'react'
import Header from './components/Header'
import UsageStatistic from './components/UsageStatistic'
import DisableButton from './components/DisableButton'
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
      disabledHosts: props.disabledHosts,
      proxyUrl: props.proxyUrl
    }

    chrome.runtime.onMessage.addListener(this.stateWasUpdatedFromBackground)
  }

  enableSwitchWasChanged = () => {
    this.setState(
      prevState => ({ enabled: !prevState.enabled }),
      this.stateWasUpdatedFromUI
    )
  }

  siteWasDisabled = () => {
    const { hostname } = parseUrl(this.props.currentUrl)
    this.setState(
      prevState => ({
        disabledHosts: prevState.disabledHosts.concat(hostname)
      }),
      this.stateWasUpdatedFromUI
    )
  }

  siteWasEnabled = () => {
    const { hostname } = parseUrl(this.props.currentUrl)
    this.setState(
      prevState => ({
        disabledHosts: prevState.disabledHosts.filter(site => site !== hostname)
      }),
      this.stateWasUpdatedFromUI
    )
  }

  disabledHostsWasChanged = (_: Event, { value }: { value: string }) => {
    this.setState(
      prevState => ({ disabledHosts: value.split('\n') }),
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
    chrome.storage.local.set(this.state)
    chrome.runtime.sendMessage(this.state)
  }

  /**
   * Receive state changes from background process and update UI.
   */
  stateWasUpdatedFromBackground = (newState: AppState) => {
    this.setState(newState)
  }

  render() {
    const { enabled, statistics, disabledHosts, proxyUrl } = this.state
    return (
      <div>
        <Header enabled={enabled} onChange={this.enableSwitchWasChanged} />
        <UsageStatistic
          filesProcessed={statistics.filesProcessed}
          bytesProcessed={statistics.bytesProcessed}
          bytesSaved={statistics.bytesSaved}
        />
        <DisableButton
          disabledHosts={disabledHosts}
          currentUrl={this.props.currentUrl}
          onSiteDisable={this.siteWasDisabled}
          onSiteEnable={this.siteWasEnabled}
        />
        <SettingsAccordion
          disabledHosts={disabledHosts}
          disabledOnChange={this.disabledHostsWasChanged}
          proxyUrl={proxyUrl}
          proxyUrlOnChange={this.proxyUrlWasChanged}
          proxyUrlOnReset={this.proxyUrlWasReset}
        />
        <Footer />
      </div>
    )
  }
}
