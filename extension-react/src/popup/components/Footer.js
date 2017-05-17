import React from 'react'
import { Button, Container } from 'semantic-ui-react'

export default () => {
  return (
    <Container style={{ padding: '1em 0' }} textAlign="right">
      <Button
        basic
        content="How it works?"
        href="https://github.com/ayastreb/bandwidth-hero#how-it-works"
        target="_blank"
        icon="github"
        labelPosition="right"
      />
    </Container>
  )
}
