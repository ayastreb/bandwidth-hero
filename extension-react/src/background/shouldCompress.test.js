import shouldCompress from './shouldCompress'

it('should not compress when app is disabled', () => {
  const state = {
    enabled: false,
    proxyUrl: 'https://webtask.io/bandwidth-hero'
  }

  expect(shouldCompress('https://google.com/logo.png', state)).toBeFalsy()
})

it('should only compress http or https schema URLs', () => {
  const state = {
    enabled: true,
    proxyUrl: 'https://webtask.io/bandwidth-hero'
  }

  expect(shouldCompress('file:///foo/bar.png', state)).toBeFalsy()
  expect(shouldCompress('chrome-extension:///logo.png', state)).toBeFalsy()
  expect(shouldCompress('http://google.com/logo.png', state)).toBeTruthy()
  expect(shouldCompress('https://google.com/logo.png', state)).toBeTruthy()
})

it('should not compress favicons or .svg', () => {
  const state = {
    enabled: true,
    proxyUrl: 'https://webtask.io/bandwidth-hero'
  }

  expect(shouldCompress('http://google.com/favicon.png', state)).toBeFalsy()
  expect(shouldCompress('http://google.com/favicon-64.png', state)).toBeFalsy()
  expect(shouldCompress('http://google.com/fav.ico', state)).toBeFalsy()
  expect(shouldCompress('http://google.com/logo.svg', state)).toBeFalsy()
})

it('should not compress images from its own proxy', () => {
  const state = {
    enabled: true,
    proxyUrl: 'https://webtask.io/bandwidth-hero'
  }

  expect(
    shouldCompress('https://webtask.io/bandwidth-hero/logo.png', state)
  ).toBeFalsy()
  expect(shouldCompress('https://webtask.io/logo.png', state)).toBeTruthy()
})
