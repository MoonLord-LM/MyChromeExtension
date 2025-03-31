typeof (showLoadedFile) === 'function' && showLoadedFile();


// streamtape.com
var videoElement = document.querySelector('iframe[data-src*="streamtape.com/"]');

// bigwarp.io
if (videoElement != null) {
    videoElement = document.querySelector('iframe[data-src*="bigwarp.io/"]');
}

if (videoElement != null) {
    var dataSrc = videoElement.getAttribute('data-src');
    console.log('dataSrc: ' + dataSrc);
    var updatedLink = dataSrc;
    updatedLink = updatedLink.replace(/streamtape.com/g, 'watchadsontape.com');
    updatedLink = updatedLink.replace(/bigwarp.io/g, 'bigwarp.art');
    console.log('updatedLink: ' + updatedLink);
    window.location.href = updatedLink;
}


