import React from 'react'
import renderer from 'react-test-renderer'
import UsageStatistic from './UsageStatistic'

it('renders statistics with default values correctly', () => {
  const tree = renderer.create(<UsageStatistic />).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders statistics with prop values correctly', () => {
  const tree = renderer
    .create(
      <UsageStatistic
        filesProcessed={3}
        bytesProcessed={2048}
        bytesSaved={1024}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
