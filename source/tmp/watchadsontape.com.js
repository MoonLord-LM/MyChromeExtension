typeof (showLoadedFile) === 'function' && showLoadedFile();


var robotlink = document.getElementById('robotlink');
if (robotlink != null) {
    var link = robotlink.innerHTML;
    console.log('link: ' + link);
    var updatedLink = link.replace(/&amp;/g, '&');
    console.log('updatedLink: ' + updatedLink);
    window.location.href = updatedLink;
}


