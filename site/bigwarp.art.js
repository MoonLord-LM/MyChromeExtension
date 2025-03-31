typeof (showLoadedFile) === 'function' && showLoadedFile();


var video = document.querySelector('video');
if (video != null) {
    var link = video.src;
    console.log('link: ' + link);
    window.location.href = link;
}


