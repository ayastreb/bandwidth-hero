import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import Header from '../components/Header'
import Home from '../components/Home'
import Footer from '../components/Footer'
import parseUrl from '../utils/parseUrl'
import defaults from '../defaults'

export default class Popup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      enabled: props.enabled,
      statistics: props.statistics,
      disabledHosts: props.disabledHosts,
      convertBw: props.convertBw,
      compressionLevel: props.compressionLevel,
      isWebpSupported: props.isWebpSupported,
      proxyUrl: props.proxyUrl
    }
    if(!chrome.storage.onChanged.hasListener(this.stateWasUpdatedFromBackground)){
        chrome.storage.onChanged.addListener(this.stateWasUpdatedFromBackground);
    }
  }

  enableSwitchWasChanged = () => {
    this.setState(prevState => {
        let enabled = { enabled: !prevState.enabled }
        chrome.storage.local.set(enabled)
        return enabled
      }
    )
  }

  siteWasDisabled = () => {
    const { hostname } = parseUrl(this.props.currentUrl)
    this.setState(
      prevState => {
          let disabledHosts = {disabledHosts: prevState.disabledHosts.concat(hostname)}
          chrome.storage.local.set(disabledHosts)
          return disabledHosts
      }
    )
  }

  siteWasEnabled = () => {
    const { hostname } = parseUrl(this.props.currentUrl)
    this.setState(
      prevState => {
        let disabledHosts = {disabledHosts: prevState.disabledHosts.filter(site => site !== hostname)}
        chrome.storage.local.set(disabledHosts)
        return disabledHosts
      }
    )
  }

  disabledHostsWasChanged = (_, { value }) => {
    this.setState(() => {
        let disabledHosts = { disabledHosts: value.split('\n') }
        chrome.storage.local.set(disabledHosts)
        return disabledHosts
      }
    )
  }

  convertBwWasChanged = () => {
    this.setState(prevState => {
        let convertBw = { convertBw: !prevState.convertBw }
        chrome.storage.local.set(convertBw)
        return convertBw
      }
    )
  }

  compressionLevelWasChanged = (_, { value }) => {
    this.setState(() => {
        let compressionLvl = {compressionLevel: value }
        chrome.storage.local.set(compressionLvl)
        return compressionLvl
      }
    )
  }

  /**
   * Receive state changes from background process and update UI.
   */
  stateWasUpdatedFromBackground = changes => {
    var changedItems = Object.keys(changes)
    for (var item of changedItems) {
        if( this.state[item] !== changes[item].newValue){
            this.setState( { [item]: changes[item].newValue } )
        }
    }
  }

  render() {
    return (
      <Router>
        <div>
          <Header enabled={this.state.enabled} onChange={this.enableSwitchWasChanged} />
          <Route
            exact
            path="/"
            render={() => (
              <Home
                {...this.state}
                currentUrl={this.props.currentUrl}
                onSiteDisable={this.siteWasDisabled}
                onSiteEnable={this.siteWasEnabled}
                disabledOnChange={this.disabledHostsWasChanged}
                convertBwOnChange={this.convertBwWasChanged}
                compressionLevelOnChange={this.compressionLevelWasChanged}
              />
            )}
          />
          <Footer />
        </div>
      </Router>
    )
  }
}
