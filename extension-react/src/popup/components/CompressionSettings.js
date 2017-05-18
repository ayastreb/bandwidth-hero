import React from 'react'
import { Form } from 'semantic-ui-react'

export default ({ proxyUrl = '' }: { proxyUrl?: string }) => {
  return (
    <Form>
      <Form.Input label="Webtask URL" type="url" value={proxyUrl} />
    </Form>
  )
}
