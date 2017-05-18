import React from 'react'
import ManageWhitelist from './ManageWhitelist'
import renderer from 'react-test-renderer'

it('renders whitelist management correctly', () => {
  const tree = renderer.create(<ManageWhitelist />).toJSON()
  expect(tree).toMatchSnapshot()
})
