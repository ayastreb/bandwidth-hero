import React from 'react'
import { Grid, Image, Container, Checkbox } from 'semantic-ui-react'
import logo from '../../assets/logo.png'

export default ({ enabled, onEnabledClick }) => {
  return (
    <Container style={{ padding: '1em 0' }}>
      <Grid>
        <Grid.Column width={12}>
          <Image src={logo} />
        </Grid.Column>
        <Grid.Column width={4} verticalAlign="middle" textAlign="center">
          <Checkbox toggle checked={enabled} onChange={onEnabledClick} />
        </Grid.Column>
      </Grid>
    </Container>
  )
}
