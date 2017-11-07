// @flow
import { Netmask } from 'netmask'

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
  const skip = [proxyUrl, 'favicon', '.*.ico', '.*.svg'].concat(disabledHosts)
  const skipRegExp = new RegExp(`(${skip.join('|')})`, 'i')

  return (
    enabled &&
    /https?:\/\/.+/i.test(imageUrl) &&
    !isPrivateNetwork(imageUrl) &&
    !hasTracking(imageUrl) &&
    !disabledHosts.includes(pageUrl) &&
    !skipRegExp.test(imageUrl)
  )
}

function isPrivateNetwork(url) {
  if (/^https?:\/\/(localhost|127.0.0.1).*/i.test(url)) return true
  const ipAddress = url.match(/^https?:\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}).*/)
  if (ipAddress) {
    const privateBlocks = [
      new Netmask('10.0.0.0/8'),
      new Netmask('172.16.0.0/12'),
      new Netmask('192.168.0.0/16')
    ]
    for (const block of privateBlocks) {
      if (block.contains(ipAddress[1])) return true
    }
  }

  return false
}

function hasTracking(url) {
  if (
    /pixel\.*(gif|jpg|jpeg)/i.test(url) ||
    /pagead/i.test(url) ||
    url.startsWith('https://www.youtube.com/api') ||
    url.startsWith('https://www.youtube.com/ptracking') ||
    url.startsWith('https://www.google.com/ads/measurement') ||
    url.startsWith('https://www.google-analytics.com/r/collect') ||
    url.startsWith('https://securepubads.g.doubleclick.net/pcs')
  ) {
    return true
  }

  return false
}
