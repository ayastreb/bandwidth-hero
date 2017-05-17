import React from 'react'
import { Segment, Statistic } from 'semantic-ui-react'
import prettyBytes from 'pretty-bytes'

export default ({ imagesProcessed = 0, bytesSaved = 0 }) => {
  return (
    <Segment attached>
      <Statistic.Group size="mini" color="blue" widths={2}>
        <Statistic>
          <Statistic.Value>{imagesProcessed.toLocaleString()}</Statistic.Value>
          <Statistic.Label>Images processed</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>{prettyBytes(bytesSaved)}</Statistic.Value>
          <Statistic.Label>Data saved</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </Segment>
  )
}
