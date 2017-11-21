import React from 'react'
import { Button, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

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
        as={Link}
        to="/donate"
        content="Support us!"
        icon="heart outline"
      />
    </Container>
  )
}
