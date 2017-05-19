import React from 'react'
import { Segment, Accordion, Icon } from 'semantic-ui-react'
import ManageWhitelist from './ManageWhitelist'
import CompressionSettings from './CompressionSettings'

export default ({
  whitelist,
  whitelistOnChange,
  proxyUrl,
  proxyUrlOnChange,
  proxyUrlOnReset
}: {
  whitelist: string[],
  whitelistOnChange: (event: Event, data: {}) => void,
  proxyUrl: string,
  proxyUrlOnChange: (event: Event, data: {}) => void,
  proxyUrlOnReset: () => void
}) => {
  return (
    <Segment attached>
      <Accordion>
        <Accordion.Title>
          <Icon name="dropdown" />
          Manage whitelist
        </Accordion.Title>
        <Accordion.Content>
          <ManageWhitelist whitelist={whitelist} onChange={whitelistOnChange} />
        </Accordion.Content>
        <Accordion.Title>
          <Icon name="dropdown" />
          Compression settings
        </Accordion.Title>
        <Accordion.Content>
          <CompressionSettings
            proxyUrl={proxyUrl}
            onChange={proxyUrlOnChange}
            onReset={proxyUrlOnReset}
          />
        </Accordion.Content>
      </Accordion>
    </Segment>
  )
}
