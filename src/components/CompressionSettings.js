import React from 'react'
import { Form, Input, Checkbox, Dropdown, Button } from 'semantic-ui-react'
import defaults from '../defaults'

export default ({ convertBw, compressionLevel, onConvertBwChange, onCompressionLevelChange, isWebpSupported }) => {
  const compressionToText = (description, value) => {
    const extension = isWebpSupported ? 'WEBP' : 'JPG';
    return `${description} compression (${extension} ${value})`;
  };
  const compressionLevelOptions = [
    { key: 80, value: 80, text: compressionToText('Low', 80) },
    { key: 60, value: 60, text: compressionToText('Medium', 60) },
    { key: 40, value: 40, text: compressionToText('High', 40) },
    { key: 20, value: 20, text: compressionToText('Extreme', 20) }
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
