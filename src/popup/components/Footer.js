import React from 'react'
import { Button, Container } from 'semantic-ui-react'

export default () => {
  return (
    <Container className="footer" textAlign="right">
      <Button
        basic
        content="How it works?"
        href="https://bandwidth-hero.com/"
        target="_blank"
        icon="home"
        labelPosition="right"
      />
      <Button
        basic
        content="Donate!"
        href="https://paypal.me/ayastreb"
        target="_blank"
        icon="diamond"
        labelPosition="right"
      />
    </Container>
  )
}
