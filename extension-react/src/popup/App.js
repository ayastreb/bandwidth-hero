import React from 'react'
import Header from './components/Header'
import Statistic from './components/Statistic'
import WhitelistButton from './components/WhitelistButton'
import SettingsAccordion from './components/SettingsAccordion'
import Footer from './components/Footer'

export default () => {
  return (
    <div>
      <Header />
      <Statistic />
      <WhitelistButton />
      <SettingsAccordion />
      <Footer />
    </div>
  )
}
