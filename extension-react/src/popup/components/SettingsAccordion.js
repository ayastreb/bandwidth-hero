import React from 'react'
import { Segment, Accordion, Icon } from 'semantic-ui-react'
import ManageWhitelist from './ManageWhitelist'
import CompressionSettings from './CompressionSettings'

export default () => {
  return (
    <Segment attached>
      <Accordion>
        <Accordion.Title>
          <Icon name="dropdown" />
          Manage whitelist
        </Accordion.Title>
        <Accordion.Content>
          <ManageWhitelist />
        </Accordion.Content>
        <Accordion.Title>
          <Icon name="dropdown" />
          Compression settings
        </Accordion.Title>
        <Accordion.Content>
          <CompressionSettings />
        </Accordion.Content>
      </Accordion>
    </Segment>
  )
}
