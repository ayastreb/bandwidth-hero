import patchContentSecurity from './patchContentSecurity'

it('should return new headers array with patched header', () => {
  const originalHeaders = [
    {
      name: 'Content-Type',
      value: 'image/webp'
    },
    {
      name: 'Content-Security-Policy',
      value: 'img-src https://google.com; block-all-mixed-content'
    }
  ]
  const proxyUrl = 'https://webtask.io/bandwidth-hero'
  const expectedHeaders = [
    {
      name: 'Content-Type',
      value: 'image/webp'
    },
    {
      name: 'Content-Security-Policy',
      value: 'img-src https://webtask.io https://google.com;'
    }
  ]

  expect(patchContentSecurity(originalHeaders, proxyUrl)).toEqual(
    expectedHeaders
  )
})
