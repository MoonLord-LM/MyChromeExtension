typeof (showLoadedFile) === 'function' && showLoadedFile();


var video = null;
setInterval(function () {
    if (video === null) {
        video = document.querySelector('video');
        if (video != null) {
            var link = video.src;
            console.log('link: ' + link);
            window.location.href = link;
        }
    }
}, 3000);


