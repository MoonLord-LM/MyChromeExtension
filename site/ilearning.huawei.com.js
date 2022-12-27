typeof(my_show_loaded_js) === 'function' && my_show_loaded_js();



// 允许右键菜单、选中文本
var allow_mouse_interact = function () {
    var exam_content = document.querySelector(".exam-content-container")
    if(exam_content !== null){
        /*
        document.querySelector(".exam-content-container").addEventListener("selectstart", (function(e) {
            return e.preventDefault(),
            !1
        }
        )),
        document.querySelector(".exam-content-container").addEventListener("contextmenu", (function(e) {
            return e.preventDefault(),
            !1
        }
        */
        exam_content.className = '';
        exam_content.oncontextmenu = function () {
            console.log('exam_content.oncontextmenu');
        };
        exam_content.onselectstart = function () {
            console.log('exam_content.onselectstart');
        };
    }
    console.log('allow_mouse_interact is running ...');
}
allow_mouse_interact();
setInterval(allow_mouse_interact, 3000);


