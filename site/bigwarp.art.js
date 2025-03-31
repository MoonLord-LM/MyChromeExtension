typeof (showLoadedFile) === 'function' && showLoadedFile();


setInterval(function() {
    video = document.querySelector('video');
    if (video != null) {
        var link = video.src;
        console.log('link: ' + link);
        window.location.href = link;
    }
}, 3000);


