import React from 'react'
import CompressionSettings from './CompressionSettings'
import renderer from 'react-test-renderer'

it('renders compression settings correctly', () => {
  const tree = renderer.create(<CompressionSettings />).toJSON()
  expect(tree).toMatchSnapshot()
})
