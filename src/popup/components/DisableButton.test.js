import React from 'react'
import DisableButton from './DisableButton'
import renderer from 'react-test-renderer'

it('renders disable button correctly', () => {
  const tree = renderer
    .create(<DisableButton disabledHosts={[]} currentUrl="https://google.com/foo.png" />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders enable button correctly', () => {
  const tree = renderer
    .create(
      <DisableButton disabledHosts={['google.com']} currentUrl="https://google.com/foo.png" />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('does not render on non-URL pages', () => {
  const tree = renderer
    .create(<DisableButton disabledHosts={[]} currentUrl="file:///foo.png" />)
    .toJSON()
  expect(tree).toBeNull()
})
