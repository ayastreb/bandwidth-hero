import React from 'react'
import renderer from 'react-test-renderer'
import Statistic from './Statistic'

it('renders statistics with default values correctly', () => {
  const tree = renderer.create(<Statistic />).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders statistics with prop values correctly', () => {
  const tree = renderer
    .create(<Statistic imagesProcessed={3} bytesSaved={1024} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
