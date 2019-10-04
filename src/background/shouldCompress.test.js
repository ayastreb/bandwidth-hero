import shouldCompress from './shouldCompress'

it('should not compress when app is disabled', () => {
  expect(
    shouldCompress({
      imageUrl: 'https://google.com/logo.png',
      pageUrl: 'https://google.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      disabledHosts: [],
      enabled: false
    })
  ).toBeFalsy()
})

it('should not compress when there is no proxy set', () => {
  expect(
    shouldCompress({
      imageUrl: 'https://google.com/logo.png',
      pageUrl: 'https://google.com',
      compressed: new Set(),
      proxyUrl: '',
      disabledHosts: [],
      enabled: true
    })
  ).toBeFalsy()
})

it('should only compress http or https schema URLs', () => {
  expect(
    shouldCompress({
      imageUrl: 'http://google.com/logo.png',
      pageUrl: 'http://google.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      disabledHosts: [],
      enabled: true
    })
  ).toBeTruthy()

  expect(
    shouldCompress({
      imageUrl: 'https://google.com/logo.png',
      pageUrl: 'https://google.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      disabledHosts: [],
      enabled: true
    })
  ).toBeTruthy()

  expect(
    shouldCompress({
      imageUrl: 'file:///foo/bar.png',
      pageUrl: 'http://localhost',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      disabledHosts: [],
      enabled: true
    })
  ).toBeFalsy()

  expect(
    shouldCompress({
      imageUrl: 'chrome-extension:///logo.png',
      pageUrl: 'chrome-extension:///foo',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      disabledHosts: [],
      enabled: true
    })
  ).toBeFalsy()

  expect(
    shouldCompress({
      imageUrl: 'moz-extension:///logo.png',
      pageUrl: 'moz-extension:///foo',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      disabledHosts: [],
      enabled: true
    })
  ).toBeFalsy()

  expect(
    shouldCompress({
      imageUrl: 'about:config',
      pageUrl: 'about:config',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      disabledHosts: [],
      enabled: true
    })
  ).toBeFalsy()

  expect(
    shouldCompress({
      imageUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP',
      pageUrl: 'https://google.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      disabledHosts: [],
      enabled: true
    })
  ).toBeFalsy()
})

it('should not compress when img is redirected', () => {
  const compressed = new Set()
  expect(
    shouldCompress({
      imageUrl: 'https://google.com/logo.png',
      pageUrl: 'https://google.com',
      compressed,
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      disabledHosts: [],
      enabled: true
    })
  ).toBeTruthy()
  compressed.add('https://google.com/logo.png')
  expect(
    shouldCompress({
      imageUrl: 'https://google.com/logo.png',
      pageUrl: 'https://google.com',
      compressed,
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      disabledHosts: [],
      enabled: true
    })
  ).toBeFalsy()
})

it('should not compress favicons, .ico, and .svg', () => {
  expect(
    shouldCompress({
      imageUrl: 'http://google.com/favicon.png',
      pageUrl: 'http://google.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      disabledHosts: [],
      enabled: true
    })
  ).toBeFalsy()

  expect(
    shouldCompress({
      imageUrl: 'http://google.com/favicon-64.png',
      pageUrl: 'http://google.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      disabledHosts: [],
      enabled: true
    })
  ).toBeFalsy()

  expect(
    shouldCompress({
      imageUrl: 'http://google.com/fav.ico',
      pageUrl: 'http://google.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      disabledHosts: [],
      enabled: true
    })
  ).toBeFalsy()

  expect(
    shouldCompress({
      imageUrl: 'http://google.com/logo.svg',
      pageUrl: 'http://google.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      disabledHosts: [],
      enabled: true
    })
  ).toBeFalsy()
})

it('should not compress images from its own proxy', () => {
  expect(
    shouldCompress({
      imageUrl: 'https://webtask.io/bandwidth-hero/logo.png',
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      pageUrl: 'http://google.com',
      compressed: new Set(),
      disabledHosts: [],
      enabled: true
    })
  ).toBeFalsy()

  expect(
    shouldCompress({
      imageUrl: 'https://webtask.io/logo.png',
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      pageUrl: 'https://webtask.io',
      compressed: new Set(),
      disabledHosts: [],
      enabled: true
    })
  ).toBeTruthy()
})

it('should not compress if current page is disabled', () => {
  expect(
    shouldCompress({
      imageUrl: 'https://foo.com/logo.png',
      pageUrl: 'google.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      disabledHosts: ['google.com', 'bing.com'],
      enabled: true
    })
  ).toBeFalsy()
})

it('should not compress if url is in disabled hosts list', () => {
  expect(
    shouldCompress({
      imageUrl: 'https://bing.com/logo.png',
      disabledHosts: ['google.com', 'bing.com'],
      pageUrl: 'foo.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeFalsy()
})

it('should not compress private IP address network', () => {
  expect(
    shouldCompress({
      imageUrl: 'https://localhost/logo.png',
      disabledHosts: ['google.com'],
      pageUrl: 'foo.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeFalsy()
  expect(
    shouldCompress({
      imageUrl: 'http://127.0.0.1/logo.png',
      disabledHosts: ['google.com'],
      pageUrl: 'foo.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeFalsy()
  expect(
    shouldCompress({
      imageUrl: 'https://192.168.0.10/logo.png',
      disabledHosts: ['google.com'],
      pageUrl: 'foo.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeFalsy()
  expect(
    shouldCompress({
      imageUrl: 'https://10.0.0.15/logo.png',
      disabledHosts: ['google.com'],
      pageUrl: 'foo.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeFalsy()
  expect(
    shouldCompress({
      imageUrl: 'https://172.16.0.100/logo.png',
      disabledHosts: ['google.com'],
      pageUrl: 'foo.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeFalsy()
  expect(
    shouldCompress({
      imageUrl: 'https://192.169.0.1/logo.png',
      disabledHosts: ['google.com'],
      pageUrl: 'foo.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeTruthy()
  expect(
    shouldCompress({
      imageUrl: 'https://172.32.0.1/logo.png',
      disabledHosts: ['google.com'],
      pageUrl: 'foo.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeTruthy()
})

it('should not compress tracking pixels', () => {
  expect(
    shouldCompress({
      imageUrl: 'https://connect.facebook.net/security/hsts-pixel.gif',
      disabledHosts: ['google.com'],
      pageUrl: 'foo.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeFalsy()
  expect(
    shouldCompress({
      imageUrl: 'https://ad-domain.com/pixel.jpg',
      disabledHosts: ['google.com'],
      pageUrl: 'foo.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeFalsy()
  expect(
    shouldCompress({
      imageUrl: 'https://ad-domain.com/cleardot.jpg',
      disabledHosts: ['google.com'],
      pageUrl: 'foo.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeFalsy()
  expect(
    shouldCompress({
      imageUrl: 'https://ssl.google-analytics.com/r/',
      disabledHosts: ['google.com'],
      pageUrl: 'foo.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeFalsy()
  expect(
    shouldCompress({
      imageUrl: 'https://www.youtube.com/api/stats?url=foo.com',
      disabledHosts: ['google.com'],
      pageUrl: 'foo.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeFalsy()

  expect(
    shouldCompress({
      imageUrl: 'https://example.com/logo-200px.jpg',
      disabledHosts: ['google.com'],
      pageUrl: 'foo.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeTruthy()
})

it('Should have a regexp with the file extension properly escaped', () => {
  expect(
    shouldCompress({
      imageUrl: 'https://siliconera.com/example.png',
      disabledHosts: [],
      pageUrl: 'siliconera.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeTruthy()
  
  expect(
    shouldCompress({
      imageUrl: 'https://whoasvgomg.com/example.png',
      disabledHosts: [],
      pageUrl: 'siliconera.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true
    })
  ).toBeTruthy()
})

it('should not compress image if the request type is XHR and url is not valid', () => {
  expect(
    shouldCompress({
      imageUrl: 'https://whoasvgomg.com/example.png',
      disabledHosts: [],
      pageUrl: 'siliconera.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true,
      type: 'xmlhttprequest'
    })
  ).toBeTruthy()

  expect(
    shouldCompress({
      imageUrl: 'https://whoasvgomg.com/example',
      disabledHosts: [],
      pageUrl: 'siliconera.com',
      compressed: new Set(),
      proxyUrl: 'https://webtask.io/bandwidth-hero',
      enabled: true,
      type: 'xmlhttprequest'
    })
  ).toBeFalsy()
});