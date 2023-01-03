typeof (showLoadedFile) === 'function' && showLoadedFile();



// 移除鼠标焦点监控，允许鼠标选中文字
// 失去焦点 onblur、右键 oncontextmenu、文字选择 onselectstart、复制 oncopy
/*
.exam-content-copy {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}
*/
var script = `
    var allow_mouse_interact = function () {
        document.disableEventListeners('blur');
        document.disableEventListeners('contextmenu');
        document.disableEventListeners('selectstart');
        document.disableEventListeners('copy');
        document.disableEventListeners('keydown');
        document.disableEventListeners('keypress');
        document.disableEventListeners('keyup');

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


