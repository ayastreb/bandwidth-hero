import React from 'react'
import { Form, TextArea } from 'semantic-ui-react'

export default () => {
  return (
    <Form>
      <Form.Field control={TextArea} rows={4} />
    </Form>
  )
}
