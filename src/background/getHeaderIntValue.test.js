import getHeaderIntValue from './getHeaderIntValue'

it('gets data from headers correctly', () => {
  const headers = [
    { name: 'Content-Length', value: '100' },
    { name: 'X-Bytes-Saved', value: '55' }
  ]

  expect(getHeaderIntValue(headers, 'x-bytes-saved')).toEqual(55)
  expect(getHeaderIntValue(headers, 'content-length')).toEqual(100)
})

it('gets data from headers with lower case names correctly', () => {
  const headers = [
    { name: 'Content-Length', value: '100' },
    { name: 'x-bytes-saved', value: '45' }
  ]

  expect(getHeaderIntValue(headers, 'x-bytes-saved')).toEqual(45)
})

it('returns zero when header is empty', () => {
  const headers = [
    { name: 'Content-Length', value: '100' },
    { name: 'x-bytes-saved', value: '' }
  ]

  expect(getHeaderIntValue(headers, 'x-bytes-saved')).toEqual(0)

})

it('returns false when no header found', () => {
  const headers = [
    { name: 'Content-Length', value: '100' }
  ]

  expect(getHeaderIntValue(headers, 'x-bytes-saved')).toEqual(false)
})
