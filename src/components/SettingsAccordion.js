import React from 'react'
import { Segment, Accordion, Icon } from 'semantic-ui-react'
import ManageDisabled from './ManageDisabled'
import CompressionSettings from './CompressionSettings'

export default ({
  disabledHosts,
  convertBw,
  compressionLevel,
  disabledOnChange,
  convertBwOnChange,
  isWebpSupported,
  compressionLevelOnChange
}) => {
  return (
    <Segment attached>
      <Accordion>
        <Accordion.Title>
          <Icon name="dropdown" />
          Manage disabled sites
        </Accordion.Title>
        <Accordion.Content>
          <ManageDisabled disabledHosts={disabledHosts} onChange={disabledOnChange} />
        </Accordion.Content>
        <Accordion.Title>
          <Icon name="dropdown" />
          Compression settings
        </Accordion.Title>
        <Accordion.Content>
          <CompressionSettings
            convertBw={convertBw}
            isWebpSupported={isWebpSupported}
            compressionLevel={compressionLevel}
            onConvertBwChange={convertBwOnChange}
            onCompressionLevelChange={compressionLevelOnChange}
          />
        </Accordion.Content>
      </Accordion>
    </Segment>
  )
}
