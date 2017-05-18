import React from 'react'
import { Form, TextArea } from 'semantic-ui-react'

export default ({ whitelist = [] }: { whitelist?: string[] }) => {
  return (
    <Form>
      <Form.Field control={TextArea} rows={4} value={whitelist.join('\n')} />
    </Form>
  )
}
