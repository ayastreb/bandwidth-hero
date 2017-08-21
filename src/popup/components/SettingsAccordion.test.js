import React from 'react'
import SettingsAccordion from './SettingsAccordion'
import renderer from 'react-test-renderer'

xit('renders settings accordion correctly', () => {
  const tree = renderer.create(<SettingsAccordion />).toJSON()
  expect(tree).toMatchSnapshot()
})
