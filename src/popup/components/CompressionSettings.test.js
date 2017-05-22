import React from 'react'
import CompressionSettings from './CompressionSettings'
import renderer from 'react-test-renderer'

it('renders compression settings correctly', () => {
  const tree = renderer
    .create(
      <CompressionSettings
        proxyUrl="http://test.io"
        onChange={() => {}}
        onReset={() => {}}
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
