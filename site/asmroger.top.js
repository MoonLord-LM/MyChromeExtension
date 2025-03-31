typeof (showLoadedFile) === 'function' && showLoadedFile();

var videoElement = document.querySelector('iframe[data-src*="streamtape.com/e/"]');
if (videoElement != null) {
    var dataSrc = videoElement.getAttribute('data-src');
    console.log('dataSrc: ' + dataSrc);
    var updatedLink = dataSrc.replace(/streamtape.com/g, 'watchadsontape.com');
    console.log('updatedLink: ' + updatedLink);
    window.location.href = updatedLink;
}


