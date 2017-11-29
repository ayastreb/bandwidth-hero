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
  onSiteDisable,
  onSiteEnable,
  disabledOnChange,
  convertBwOnChange,
  compressionLevelOnChange
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
      convertBwOnChange={convertBwOnChange}
      compressionLevelOnChange={compressionLevelOnChange}
    />
  </div>
)
