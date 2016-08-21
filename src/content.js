chrome.runtime.onMessage.addListener(request => {
    [...document.getElementsByTagName('img')].forEach(image => {
        if (image.src == request.original) {
            image.src = request.compressed;
        }
    });
    [...document.querySelectorAll('div,span')].forEach(block => {
        var bg = window.getComputedStyle(block).backgroundImage;
        if (bg.includes(request.original)) {
            block.style.backgroundImage = `url('${request.compressed}')`;
        }
    });
});

