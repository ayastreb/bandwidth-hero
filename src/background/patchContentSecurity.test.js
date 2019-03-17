import patchContentSecurity from './patchContentSecurity'

it('should return new headers array with patched header', () => {
  const originalHeaders = [
    {
      name: 'Content-Type',
      value: 'image/webp'
    },
    {
      name: 'Content-Security-Policy',
      value: "default-src 'none'; img-src https://google.com; block-all-mixed-content;"
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
      value: "default-src https://webtask.io 'none'; img-src https://webtask.io https://google.com; block-all-mixed-content;"
    }
  ]

  expect(patchContentSecurity(originalHeaders, proxyUrl)).toEqual(
    expectedHeaders
  )
})

it('should strip out "block-all-mixed-content" CSP flag, if the proxyUrl protocol is http:', () => {
    const originalHeaders = [
    {
      name: 'Content-Security-Policy',
      value: "default-src 'none'; img-src https://google.com; block-all-mixed-content; connect-src foobar.baz"
    }
  ]
  const proxyUrl = 'http://webtask.io/bandwidth-hero'
  const expectedHeaders = [
    {
      name: 'Content-Security-Policy',
      value: "default-src http://webtask.io 'none'; img-src http://webtask.io https://google.com; ; connect-src http://webtask.io foobar.baz"
    }
  ]

  expect(patchContentSecurity(originalHeaders, proxyUrl)).toEqual(
    expectedHeaders
  )
})
