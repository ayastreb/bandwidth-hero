import React from 'react'
import Footer from './Footer'
import renderer from 'react-test-renderer'

it('renders footer correctly', () => {
  const tree = renderer.create(<Footer />).toJSON()
  expect(tree).toMatchSnapshot()
})
