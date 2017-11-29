import React from 'react'
import ManageDisabled from './ManageDisabled'
import renderer from 'react-test-renderer'

it('renders disabled sites management correctly', () => {
  const tree = renderer.create(<ManageDisabled />).toJSON()
  expect(tree).toMatchSnapshot()
})
