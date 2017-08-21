import React from 'react'
import { Segment, Accordion, Icon } from 'semantic-ui-react'
import ManageDisabled from './ManageDisabled'
import CompressionSettings from './CompressionSettings'

export default ({
  disabledHosts,
  disabledOnChange,
  proxyUrl,
  proxyUrlOnChange,
  proxyUrlOnReset
}: {
  disabledHosts: string[],
  disabledOnChange: (event: Event, data: {}) => void,
  proxyUrl: string,
  proxyUrlOnChange: (event: Event, data: {}) => void,
  proxyUrlOnReset: () => void
}) => {
  return (
    <Segment attached>
      <Accordion>
        <Accordion.Title>
          <Icon name="dropdown" />
          Manage disabled sites
        </Accordion.Title>
        <Accordion.Content>
          <ManageDisabled
            disabledHosts={disabledHosts}
            onChange={disabledOnChange}
          />
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
