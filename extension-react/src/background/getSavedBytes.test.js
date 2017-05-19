import getSavedBytes from './getSavedBytes'

it('gets data from headers correctly', () => {
  const headers = [
    { name: 'Content-Length', value: '100' },
    { name: 'X-Bytes-Saved', value: '55' }
  ]

  expect(getSavedBytes(headers)).toEqual(55)
})

it('gets data from headers with lower case names correctly', () => {
  const headers = [
    { name: 'Content-Length', value: '100' },
    { name: 'x-bytes-saved', value: '45' }
  ]

  expect(getSavedBytes(headers)).toEqual(45)
})

it('returns false when no header found', () => {
  const headers = [
    { name: 'Content-Length', value: '100' }
  ]

  expect(getSavedBytes(headers)).toEqual(false)
})
