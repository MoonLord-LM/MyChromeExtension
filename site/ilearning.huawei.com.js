typeof (showLoadedFile) === 'function' && showLoadedFile();



/*
处理 JS 事件：
    失去焦点 onblur、右键 oncontextmenu、文字选择 onselectstart、复制 oncopy、按键 keydown keypress keyup
处理 CSS 样式： 
    .exam-content-copy {
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
*/

// 移除鼠标焦点监控，允许鼠标选中文字
var allow_mouse_interact = function () {
    if(document.disableEventListeners){
        document.disableEventListeners('blur');
        document.disableEventListeners('contextmenu');
        document.disableEventListeners('selectstart');
        document.disableEventListeners('copy');
        document.disableEventListeners('keydown');
        document.disableEventListeners('keypress');
        document.disableEventListeners('keyup');
    }
    var elements = document.querySelectorAll('.exam-content-copy');
    elements.forEach(element => {
        element.style.userSelect = '';
        element.style.mozUserSelect = '';
        element.style.webkitUserSelect = '';
        element.style.msUserSelect = '';
        element.classList.remove('exam-content-copy');
    });
    console.log('allow_mouse_interact is running ...');
}
allow_mouse_interact();
setInterval(allow_mouse_interact, 3000);


