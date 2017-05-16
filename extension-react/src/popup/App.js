import React from 'react'
import { Container, Image } from 'semantic-ui-react'
import logo from '../assets/logo.png'

export default () => {
  return (
    <Container>
      <Image centered={true} src={logo} />
    </Container>
  )
}
