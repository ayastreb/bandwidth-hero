// @flow
export default (
  imageUrl: string,
  state: { enabled: boolean, whitelist: string[], proxyUrl: string }
): boolean => {
  const skip = [state.proxyUrl, 'favicon', '.*\.ico', '.*\.svg']
  const skipRegExp = new RegExp(`(${skip.join('|')})`, 'i')

  return (
    state.enabled &&
    /https?:\/\/.+/i.test(imageUrl) &&
    !skipRegExp.test(imageUrl)
  )
}
