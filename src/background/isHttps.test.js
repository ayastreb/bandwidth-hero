import isHttps from './isHttps'

it('should evaluate https site as true', () => {
  expect(
    isHttps("https://google.com")
  ).toBeTruthy()
})

it('should evaluate http site as false', () => {
    expect(
        isHttps("http://google.com")
    ).toBeFalsy()
})

it('non-URLs should return null instead of erroring out', () => {
    expect(
        isHttps("foobarbaz")
    ).toBeNull()
})
