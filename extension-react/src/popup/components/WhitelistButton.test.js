import React from 'react'
import WhitelistButton from './WhitelistButton'
import renderer from 'react-test-renderer'

it('renders whitelist button correctly', () => {
  const tree = renderer
    .create(
      <WhitelistButton whitelist={[]} currentUrl="https://google.com/foo.png" />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders remove from whitelist button correctly', () => {
  const tree = renderer
    .create(
      <WhitelistButton
        whitelist={['google.com']}
        currentUrl="https://google.com/foo.png"
      />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('does not render on non-URL pages', () => {
  const tree = renderer
    .create(<WhitelistButton whitelist={[]} currentUrl="file:///foo.png" />)
    .toJSON()
  expect(tree).toBeNull()
})
