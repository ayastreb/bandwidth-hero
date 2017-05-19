import React from 'react'
import { Segment, Button } from 'semantic-ui-react'
import parseUrl from '../../utils/parseUrl'

export default ({
  whitelist,
  currentUrl,
  onAddToWhitelist,
  onRemoveFromWhitelist
}: {
  whitelist: string[],
  currentUrl: string,
  onAddToWhiteList: () => void,
  onRemoveFromWhitelist: () => void
}) => {
  const { schema, hostname } = parseUrl(currentUrl)

  if (!/^https?:/i.test(schema)) return null
  if (whitelist.includes(hostname)) {
    return (
      <Segment attached>
        <Button
          content="Remove from whitelist"
          onClick={onRemoveFromWhitelist}
          basic
          negative
          fluid
        />
      </Segment>
    )
  } else {
    return (
      <Segment attached>
        <Button
          content="Whitelist this site"
          onClick={onAddToWhitelist}
          basic
          positive
          fluid
        />
      </Segment>
    )
  }
}
