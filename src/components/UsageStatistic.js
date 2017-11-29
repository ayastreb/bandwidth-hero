import React from 'react'
import { Segment, Statistic } from 'semantic-ui-react'
import prettyBytes from 'pretty-bytes'

export default ({ filesProcessed = 0, bytesProcessed = 0, bytesSaved = 0 }) => {
  const dataSavedPercentage = () => {
    if (bytesProcessed === 0) return `0%`
    const percentage = Math.round(bytesSaved / bytesProcessed * 100)
    return `${percentage}%`
  }

  return (
    <Segment attached>
      <Statistic.Group size="mini" color="blue" widths={2}>
        <Statistic>
          <Statistic.Value>{filesProcessed.toLocaleString()}</Statistic.Value>
          <Statistic.Label>Images processed</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>
            {prettyBytes(bytesSaved)} ({dataSavedPercentage()})
          </Statistic.Value>
          <Statistic.Label>Data saved</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </Segment>
  )
}
