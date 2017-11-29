import React from 'react'
import { Segment, Button } from 'semantic-ui-react'
import parseUrl from '../utils/parseUrl'

export default ({ disabledHosts, currentUrl, onSiteDisable, onSiteEnable }) => {
  const { schema, hostname } = parseUrl(currentUrl)

  if (!/^https?:/i.test(schema)) return null
  if (disabledHosts.includes(hostname)) {
    return (
      <Segment attached>
        <Button content="Enable on this site" onClick={onSiteEnable} basic negative fluid />
      </Segment>
    )
  } else {
    return (
      <Segment attached>
        <Button content="Disable on this site" onClick={onSiteDisable} basic positive fluid />
      </Segment>
    )
  }
}
