import React from 'react'
import UsageStatistic from './UsageStatistic'
import DisableButton from './DisableButton'
import SettingsAccordion from './SettingsAccordion'

export default ({
  enabled,
  statistics,
  disabledHosts,
  convertBw,
  compressionLevel,
  currentUrl,
  proxyUrl,
  onSiteDisable,
  onSiteEnable,
  disabledOnChange,
  convertBwOnChange,
  compressionLevelOnChange,
  proxyUrlOnChange,
  proxyUrlOnReset
}) => (
  <div>
    <UsageStatistic
      filesProcessed={statistics.filesProcessed}
      bytesProcessed={statistics.bytesProcessed}
      bytesSaved={statistics.bytesSaved}
    />
    <DisableButton
      disabledHosts={disabledHosts}
      currentUrl={currentUrl}
      onSiteDisable={onSiteDisable}
      onSiteEnable={onSiteEnable}
    />
    <SettingsAccordion
      disabledHosts={disabledHosts}
      disabledOnChange={disabledOnChange}
      convertBw={convertBw}
      compressionLevel={compressionLevel}
      proxyUrl={proxyUrl}
      convertBwOnChange={convertBwOnChange}
      compressionLevelOnChange={compressionLevelOnChange}
      proxyUrlOnChange={proxyUrlOnChange}
      proxyUrlOnReset={proxyUrlOnReset}
    />
  </div>
)
