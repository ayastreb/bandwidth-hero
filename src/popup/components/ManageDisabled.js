import React from 'react'
import { Form, TextArea } from 'semantic-ui-react'

export default ({
  disabledHosts = [],
  onChange
}: {
  disabledHosts?: string[],
  onChange: (event: Event, data: {}) => void
}) => {
  return (
    <Form>
      <Form.Field
        control={TextArea}
        rows={4}
        value={disabledHosts.join('\n')}
        onChange={onChange}
      />
    </Form>
  )
}
