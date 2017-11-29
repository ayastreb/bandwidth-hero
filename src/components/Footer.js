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
      />
      <Button
        basic
        color="orange"
        href="https://paypal.me/ayastreb"
        target="_blank"
        content="Donate!"
        icon="heart outline"
      />
    </Container>
  )
}
