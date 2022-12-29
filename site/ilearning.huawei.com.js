typeof (showLoadedFile) === 'function' && showLoadedFile();



// 移除焦点监控，允许鼠标选中文字
var script = `
var allow_mouse_interact = function () {
    document.disableEventListeners('contextmenu');
    document.disableEventListeners('selectstart');
    document.disableEventListeners('blur');

    var content = document.querySelector('.exam-content-copy');
    if (content !== null) {
        content.classList.remove('exam-content-copy');
    }
    console.log('allow_mouse_interact is running ...');
}
allow_mouse_interact();
setInterval(allow_mouse_interact, 3000);
`;

document.dispatchEvent(new CustomEvent('executeScript', { detail: script }));


