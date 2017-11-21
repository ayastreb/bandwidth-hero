import React from 'react'
import { Link } from 'react-router-dom'
import { Segment, Button } from 'semantic-ui-react'

export default () => (
  <Segment attached>
    <h3>Donations appreciated!</h3>
    <p>
      Bandwidth Hero is an open source project.<br />We provide public data compression service for
      free, but the servers where it runs are not free!
    </p>
    <p>
      We kindly ask you to help us run the service by contributing to one the following platforms:
    </p>
    <p style={{ display: 'flex' }}>
      <Button
        basic
        fluid
        content="Pateron"
        href="https://www.patreon.com/bandwidthhero"
        target="_blank"
        icon="users"
      />
      <Button
        basic
        fluid
        content="PayPal"
        href="https://paypal.me/ayastreb"
        target="_blank"
        icon="paypal"
      />
    </p>
    <p>
      <Link to="/">Go back</Link>
    </p>
  </Segment>
)
