typeof (showLoadedFile) === 'function' && showLoadedFile();



// 允许鼠标选中文字
var script = `
var allow_mouse_interact = function () {
    var content1 = document.querySelector('.exam-content-container');
    if (content1 !== null) {
        content1.oncontextmenu = function () { };
        content1.onselectstart = function () { };
        content1.disableEventListeners('contextmenu');
        content1.disableEventListeners('selectstart');
    }
    var content2 = document.querySelector('.exam-content-copy');
    if (content2 !== null) {
        content2.classList.remove('exam-content-copy');
    }
    console.log('allow_mouse_interact is running ...');
}
allow_mouse_interact();
setInterval(allow_mouse_interact, 3000);
`;

document.dispatchEvent(new CustomEvent('executeScript', { detail: script }));


