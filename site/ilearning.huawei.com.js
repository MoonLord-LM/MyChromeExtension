typeof(my_show_loaded_js) === 'function' && my_show_loaded_js();



// 禁用切屏检测
var disable_switch_detect = function () {
    window.onblur = function () {
        console.log('window.onblur - switch detect is disabled');
    };
    console.log('disable_switch_detect is running ...');
}
disable_switch_detect();
setInterval(disable_switch_detect, 3000);

// 允许右键菜单、选中文本
var allow_mouse_interact = function () {
    var exam_content = document.querySelector(".exam-content-container")
    if(exam_content !== null){
        exam_content.className = '';
        exam_content.oncontextmenu = null;
        var listeners = getEventListeners(exam_content)["contextmenu"]; // TODO
        for (i = 0; i < listeners.length; i++) {
            exam_content.removeEventListener("contextmenu", listeners[i].listener);
            console.log('allow_mouse_interact: ' + listeners[i].listener);
        }
        exam_content.onselectstart = null;
        listeners = getEventListeners(exam_content)["selectstart"]; // TODO
        for (i = 0; i < listeners.length; i++) {
            exam_content.removeEventListener("selectstart", listeners[i].listener);
            console.log('allow_mouse_interact: ' + listeners[i].listener);
        }
    }
    console.log('allow_mouse_interact is running ...');
}
allow_mouse_interact();
setInterval(allow_mouse_interact, 3000);


