my_show_loaded_js();

var script = document.createElement("script");
script.innerHTML = `
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
        var exam_content = document.querySelector('div#examin_content');
        if(exam_content !== null){
            exam_content.oncontextmenu = null;
            exam_content.onselectstart = null;
        }
        console.log('allow_mouse_interact is running ...');
    }
    allow_mouse_interact();
    setInterval(allow_mouse_interact, 3000);
`;
document.head.appendChild(script);
