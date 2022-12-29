typeof(showLoadedFile) === 'function' && showLoadedFile();



// 允许右键菜单、选中文本
var allow_mouse_interact = function () {
    var exam_content = document.querySelector(".exam-content-container");
    if(exam_content !== null){
        exam_content.oncontextmenu = function () {};
        exam_content.onselectstart = function () {};
        exam_content.clearEventListeners('contextmenu');
        exam_content.clearEventListeners('selectstart');
        exam_content.className = '';
    }
    console.log('allow_mouse_interact is running ...');
}
allow_mouse_interact();
setInterval(allow_mouse_interact, 3000);


