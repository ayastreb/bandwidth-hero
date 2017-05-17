import React from 'react'
import { Grid, Image, Segment, Checkbox } from 'semantic-ui-react'
import logo from '../../assets/logo.png'

export default () => {
  return (
    <Segment attached>
      <Grid>
        <Grid.Column width={12}>
          <Image src={logo} />
        </Grid.Column>
        <Grid.Column width={4} verticalAlign="middle" textAlign="center">
          <Checkbox toggle />
        </Grid.Column>
      </Grid>
    </Segment>
  )
}
