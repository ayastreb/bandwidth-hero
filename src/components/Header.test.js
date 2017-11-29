import React from 'react'
import Header from './Header'
import renderer from 'react-test-renderer'

it('renders header correctly', () => {
  const tree = renderer.create(<Header />).toJSON()
  expect(tree).toMatchSnapshot()
})
