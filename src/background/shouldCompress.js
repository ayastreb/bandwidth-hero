// @flow
export default ({
  imageUrl,
  pageUrl,
  proxyUrl,
  whitelist,
  enabled
}: {
  imageUrl: string,
  pageUrl: string,
  proxyUrl: string,
  whitelist: string[],
  enabled: boolean
}): boolean => {
  const skip = [proxyUrl, 'favicon', '.*\.ico', '.*\.svg'].concat(whitelist)
  const skipRegExp = new RegExp(`(${skip.join('|')})`, 'i')

  return (
    enabled &&
    /https?:\/\/.+/i.test(imageUrl) &&
    !whitelist.includes(pageUrl) &&
    !skipRegExp.test(imageUrl)
  )
}
