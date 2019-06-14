import { Netmask } from 'netmask'

export default ({ imageUrl, pageUrl, compressed, proxyUrl, disabledHosts, enabled }) => {
  imageUrl = imageUrl.replace('#bh-no-compress=1', '')
  const skip = [proxyUrl, 'favicon', '.*\\.ico', '.*\\.svg'].concat(
    disabledHosts
    .filter(
        (disabledHost) => {
            return disabledHost && disabledHost.length > 3 && disabledHost.includes('.')
        }
    )
    .map( //sanitize for regExp
        (disabledHost) => {
            return disabledHost
                .replace('.', '\\.')
                .replace('?', '\\?')
                .replace('+', '\\+')
                .replace('*', '\\*');
        }
    )
  )
  const skipRegExp = new RegExp(`(${skip.join('|')})`, 'i')
  
  console.log(pageUrl, disabledHosts);

  return (
    enabled &&
    proxyUrl !== '' &&
    !/compressor\.bandwidth-hero\.com/i.test(proxyUrl) &&
    /https?:\/\/.+/i.test(imageUrl) &&
    !compressed.has(imageUrl) &&
    !isPrivateNetwork(imageUrl) &&
    !isTracking(imageUrl) &&
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

function isTracking(url) {
  const trackingLinks = [
    /pagead/i,
    /(pixel|px|cleardot)\.*(gif|jpg|jpeg)/i,
    /google\.([a-z\.]+)\/(ads|generate_204|.*\/log204)+/i,
    /google-analytics\.([a-z\.]+)\/(r|collect)+/i,
    /youtube\.([a-z\.]+)\/(api|ptracking|player_204|live_204)+/i,
    /doubleclick\.([a-z\.]+)\/(pcs|pixel|r)+/i,
    /googlesyndication\.([a-z\.]+)\/ddm/i,
    /pixel\.facebook\.([a-z\.]+)/i,
    /facebook\.([a-z\.]+)\/(impression\.php|tr)+/i,
    /ad\.bitmedia\.io/i,
    /yahoo\.([a-z\.]+)\/pixel/i,
    /criteo\.net\/img/i
  ]

  for (const link of trackingLinks) {
    if (link.test(url)) return true
  }

  return false
}
