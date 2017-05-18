import React from 'react'
import { Segment, Accordion, Icon } from 'semantic-ui-react'
import ManageWhitelist from './ManageWhitelist'
import CompressionSettings from './CompressionSettings'

export default ({
  whitelist,
  proxyUrl
}: {
  whitelist: string[],
  proxyUrl: string
}) => {
  return (
    <Segment attached>
      <Accordion>
        <Accordion.Title>
          <Icon name="dropdown" />
          Manage whitelist
        </Accordion.Title>
        <Accordion.Content>
          <ManageWhitelist whitelist={whitelist} />
        </Accordion.Content>
        <Accordion.Title>
          <Icon name="dropdown" />
          Compression settings
        </Accordion.Title>
        <Accordion.Content>
          <CompressionSettings proxyUrl={proxyUrl} />
        </Accordion.Content>
      </Accordion>
    </Segment>
  )
}
