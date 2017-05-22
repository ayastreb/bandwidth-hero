import React from 'react'
import { Input, Button } from 'semantic-ui-react'

export default ({
  proxyUrl,
  onChange,
  onReset
}: {
  proxyUrl: string,
  onChange: (event: Event, data: {}) => void,
  onReset: () => void
}) => {
  return (
    <Input
      label="URL"
      type="url"
      fluid
      value={proxyUrl}
      onChange={onChange}
      action={<Button icon="history" onClick={onReset} />}
    />
  )
}
