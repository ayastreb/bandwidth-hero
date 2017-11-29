import React from 'react'
import { Grid, Image, Container, Checkbox } from 'semantic-ui-react'
import logo from '../assets/logo.png'

export default ({ enabled, onChange }) => {
  return (
    <Container className="header">
      <Grid>
        <Grid.Column width={12}>
          <Image src={logo} width={280} />
        </Grid.Column>
        <Grid.Column width={4} verticalAlign="middle" textAlign="right">
          {onChange && <Checkbox toggle checked={enabled} onChange={onChange} />}
        </Grid.Column>
      </Grid>
    </Container>
  )
}
