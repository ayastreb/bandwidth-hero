import React from 'react'
import { Form, Input, Checkbox, Dropdown, Button } from 'semantic-ui-react'
import defaults from '../defaults'

export default ({ convertBw, compressionLevel, onConvertBwChange, onCompressionLevelChange }) => {
  const compressionLevelOptions = [
    { key: 80, value: 80, text: 'Low compression (JPG 80)' },
    { key: 60, value: 60, text: 'Medium compression (JPG 60)' },
    { key: 40, value: 40, text: 'High compression (JPG 40)' },
    { key: 20, value: 20, text: 'Extreme compression (JPG 20)' }
  ]
  return (
    <div>
      <div>
        <Checkbox
          label="Convert to black & white"
          checked={convertBw}
          onChange={onConvertBwChange}
        />
      </div>
      <div style={{ marginTop: '1em' }}>
        <Dropdown
          selection
          options={compressionLevelOptions}
          value={compressionLevel}
          onChange={onCompressionLevelChange}
          fluid
        />
      </div>
      <div style={{ marginTop: '1em' }}>
        <Button
          basic
          fluid
          content="Configure data compression service"
          icon="setting"
          onClick={() => chrome.tabs.create({ url: 'setup.html' })}
        />
      </div>
    </div>
  )
}
