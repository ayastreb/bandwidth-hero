import shouldCompress from './background/shouldCompress'
import patchContentSecurity from './background/patchContentSecurity'
import isHttps from './background/isHttps'
import getHeaderValue from './background/getHeaderIntValue'
import parseUrl from './utils/parseUrl'
import deferredStateStorage from './utils/deferredStateStorage'
import defaultState from './defaults'
import axios from 'axios'

chrome.storage.local.get(storedState => {
    const storage = deferredStateStorage()
    let setupOpen
    let state
    let pageUrl
    let compressed = new Set();
    let isWebpSupported
    
    if (/compressor\.bandwidth-hero\.com/i.test(storedState.proxyUrl)) {
        chrome.storage.local.set({ ...storedState, proxyUrl: '' })
    }
    
    setState({ ...defaultState, ...storedState })
    
    checkWebpSupport().then(isSupported => {
        isWebpSupported = isSupported
    })
    
    const changeHandlers = {
        'enabled': () => {
            state.enabled ? attachListeners(isHttps(state.proxyUrl)) :          
                detachListeners()
            chrome.browserAction.setIcon({
                path: state.enabled ? 'assets/icon-128.png' : 'assets/icon-128- disabled.png'
            })
        },
        'proxyUrl': (oldValue) => {
            let isNewProxyHttps = isHttps(state.proxyUrl);
            if(state.enabled 
                && isNewProxyHttps !== isHttps(oldValue) 
            ){
                detachListeners()
                attachListeners(isNewProxyHttps)
            }
        }
    }
    
    async function checkWebpSupport() {
        if (!self.createImageBitmap) return false
            
            const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
            const blob = await fetch(webpData).then(r => r.blob())
            return self.createImageBitmap(blob).then(() => true, () => false)
    }
    
    /**
     * Sync state.
     */
    function setState(newState) {
        if (chrome.browserAction.setIcon && (!state || state.enabled !== newState.enabled)) {
            chrome.browserAction.setIcon({
                path: newState.enabled ? 'assets/icon-128.png' : 'assets/icon-128-disabled.png'
            })
        }
        
        if(state && state.proxyUrl !== newState.proxyUrl){
            detachListeners()
        }
        
        state = newState
        //attach or remove listeners based on state.enabled
        state.enabled ? attachListeners(isHttps(state.proxyUrl)) : detachListeners()
        return true //acknowledge
    }
    
    /**
     * refreshState
     */
    function updateState(changes) {
        var changedItems = Object.keys(changes)
        for (var item of changedItems) {
            if( state[item] !== changes[item].newValue){
                state[item] = changes[item].newValue
                if(changeHandlers[item]){
                    changeHandlers[item](changes[item].oldValue);
                }
            }
        }
    }
    
    function checkSetup() {
        if(state.enabled){
            attachListeners(isHttps(state.proxyUrl))
            if (
                !setupOpen &&
                (state.proxyUrl === '' || /compressor\.bandwidth-hero\.com/i.test(state.proxyUrl))
            ) {
                chrome.tabs.create({ url: 'setup.html' })
                setupOpen = true
            }
        }
    }
    
    /**
     * Intercept image loading request and decide if we need to compress it.
     */
    function onBeforeRequestListener({ url, documentUrl }) {
        checkSetup()
        if (
            shouldCompress({
                imageUrl: url,
                pageUrl: pageUrl || parseUrl(documentUrl).host, //occasionally pageUrl is not ready in time on FF
                    compressed,
                    proxyUrl: state.proxyUrl,
                    disabledHosts: state.disabledHosts,
                    enabled: state.enabled
            })
        ) {
            compressed.add(url)
            let redirectUrl = `${state.proxyUrl}?url=${encodeURIComponent(url)}`
            if (!isWebpSupported) redirectUrl += '&jpeg=1'
                if (!state.convertBw) redirectUrl += '&bw=0'
                    if (state.compressionLevel) {
                        redirectUrl += '&l=' + parseInt(state.compressionLevel, 10)
                    }
                    if (!isFirefox()) return { redirectUrl }
                    // Firefox allows onBeforeRequest event listener to return a Promise
                    // and perform redirect when this Promise is resolved.
                    // This allows us to run HEAD request before redirecting to compression
                    // to make sure that the image should be compressed.
                    return axios.head(url, {
                        maxContentLength: 0,
                        timeout: 60000
                    }).then(res => {
                        if (
                            res.status === 200 &&
                            res.headers['content-length'] > 1024 &&
                            res.headers['content-type'] &&
                            res.headers['content-type'].startsWith('image')
                        ) {
                            return { redirectUrl }
                        }
                    }).catch(error => {
                        if(error.response.status === 405)//HEAD method not allowed
                        {
                            return { redirectUrl }
                        }
                    })
        }
    }
    
    /**
     * Firefox user agent always has "rv:" and "Gecko"
     * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent/Firefox
     */
    function isFirefox() {
        return /rv\:.*Gecko/.test(window.navigator.userAgent)
    }
    
    /**
     * Retrieve saved bytes info from response headers, update statistics in
     * app storage and notify UI about state changes.
     */
    function onCompletedListener({ responseHeaders }) {
        const bytesSaved = getHeaderValue(responseHeaders, 'x-bytes-saved')
        const bytesProcessed = getHeaderValue(responseHeaders, 'x-original-size')
        if (bytesSaved !== false && bytesProcessed !== false) {
            state.statistics.filesProcessed += 1
            state.statistics.bytesProcessed += bytesProcessed
            state.statistics.bytesSaved += bytesSaved
            
            storage.set({statistics : state.statistics})
        }
    }
    
    function tabActivationListener({tabId}) {
        chrome.tabs.get(tabId, tab => (pageUrl = parseUrl(tab.url).hostname))
    }
    
    function tabUpdateListener(){
        if(compressed instanceof Set){
            compressed.clear()
        }else{
            compressed = new Set()
        }
    }
    
    /**
     * Patch document's content security policy headers so that it will allow
     * images loading from our compression proxy URL.
     */
    function onHeadersReceivedListener({ responseHeaders }) {
        return {
            responseHeaders: patchContentSecurity(responseHeaders, state.proxyUrl)
        }
    }
    function attachListeners(isHttps){
        if(!chrome.webRequest.onBeforeRequest.hasListener(onBeforeRequestListener)){
            chrome.webRequest.onBeforeRequest.addListener(
                onBeforeRequestListener,
                {
                    urls: ['<all_urls>'],
                    types: isFirefox() && isHttps ? ['imageset', 'image'] : ['image']
                },
                ['blocking']
            )
        }
        if(!chrome.webRequest.onCompleted.hasListener(onCompletedListener)){
            chrome.webRequest.onCompleted.addListener(
                onCompletedListener,
                {
                    urls: ['<all_urls>'],
                    types: isFirefox() && isHttps ? ['imageset', 'image'] : ['image']
                },
                ['responseHeaders']
            )
        }
        if(!chrome.webRequest.onHeadersReceived.hasListener(onHeadersReceivedListener)){
            chrome.webRequest.onHeadersReceived.addListener(
                onHeadersReceivedListener,
                {
                    urls: ['<all_urls>'],
                    types: ['main_frame', 'sub_frame', 'xmlhttprequest']
                },
                ['blocking', 'responseHeaders']
            )
        }
        if(!chrome.tabs.onActivated.hasListener(tabActivationListener)){
            chrome.tabs.onActivated.addListener(tabActivationListener)
        }
        if(!chrome.tabs.onUpdated.hasListener(tabUpdateListener)){
            chrome.tabs.onUpdated.addListener(tabUpdateListener)
        }
    }
    
    function detachListeners(){
        chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequestListener)
        chrome.webRequest.onCompleted.removeListener(onCompletedListener)
        chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceivedListener)
        chrome.tabs.onActivated.removeListener(tabActivationListener)
        chrome.tabs.onUpdated.removeListener(tabUpdateListener)
    }
    
    if(!chrome.storage.onChanged.hasListener(updateState)){
        chrome.storage.onChanged.addListener(updateState)
    }
    if(!chrome.runtime.onInstalled.hasListener(checkSetup)){
        chrome.runtime.onInstalled.addListener(checkSetup)
    }
})
