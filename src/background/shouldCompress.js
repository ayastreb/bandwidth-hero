// @flow
export default ({
  imageUrl,
  pageUrl,
  proxyUrl,
  disabledHosts,
  enabled
}: {
  imageUrl: string,
  pageUrl: string,
  proxyUrl: string,
  disabledHosts: string[],
  enabled: boolean
}): boolean => {
  const skip = [proxyUrl, 'favicon', '.*\.ico', '.*\.svg'].concat(disabledHosts)
  const skipRegExp = new RegExp(`(${skip.join('|')})`, 'i')

  return (
    enabled &&
    /https?:\/\/.+/i.test(imageUrl) &&
    !disabledHosts.includes(pageUrl) &&
    !skipRegExp.test(imageUrl)
  )
}
