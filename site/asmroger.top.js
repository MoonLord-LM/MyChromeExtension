typeof (showLoadedFile) === 'function' && showLoadedFile();


// streamtape.com
var videoElement = document.querySelector('iframe[data-src*="streamtape.com"]');
if (videoElement != null) {
    var dataSrc = videoElement.getAttribute('data-src');
    console.log('dataSrc: ' + dataSrc);
    var updatedLink = dataSrc;
    updatedLink = updatedLink.replace(/streamtape.com/g, 'watchadsontape.com');
    console.log('updatedLink: ' + updatedLink);
    window.location.href = updatedLink;
}

// bigwarp.io
if (videoElement === null) {
    videoElement = document.querySelector('iframe[src*="bigwarp.io"]');
}
if (videoElement != null) {
    var dataSrc = videoElement.getAttribute('src');
    console.log('dataSrc: ' + dataSrc);
    var updatedLink = dataSrc;
    updatedLink = updatedLink.replace(/bigwarp.io/g, 'bigwarp.cc');
    console.log('updatedLink: ' + updatedLink);
    window.location.href = updatedLink;
}


