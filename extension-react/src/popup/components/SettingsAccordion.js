import React from 'react'
import { Segment, Accordion, Icon } from 'semantic-ui-react'
import ProxySettings from './ProxySettings'
import WhitelistManage from './WhitelistManage'

export default () => {
  return (
    <Segment attached>
      <Accordion>
        <Accordion.Title>
          <Icon name="dropdown" />
          Manage whitelist
        </Accordion.Title>
        <Accordion.Content>
          <WhitelistManage />
        </Accordion.Content>
        <Accordion.Title>
          <Icon name="dropdown" />
          Change proxy URL
        </Accordion.Title>
        <Accordion.Content>
          <ProxySettings />
        </Accordion.Content>
      </Accordion>
    </Segment>
  )
}
