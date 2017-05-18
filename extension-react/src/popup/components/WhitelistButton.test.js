import React from 'react'
import WhitelistButton from './WhitelistButton'
import renderer from 'react-test-renderer'

it('renders whitelist button correctly', () => {
  const tree = renderer.create(<WhitelistButton />).toJSON()
  expect(tree).toMatchSnapshot()
})
