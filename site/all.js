// 使用 Error 的 stack，显示已加载的插件 JS 文件名
var my_show_loaded_js = function () {
    var error_stack = (new Error).stack.split("\n");
    var position = error_stack[error_stack.length - 1].trim();
    if (position.startsWith('at ')) {
        position = position.substr(3);
    }
    if (position.indexOf('(') !== -1) {
        position = position.substr(position.indexOf('(') + 1);
    }
    if (position.indexOf(':') !== -1) {
        position = position.substr(0, position.lastIndexOf(':'));
    }
    if (position.indexOf(':') !== -1) {
        position = position.substr(0, position.lastIndexOf(':'));
    }
    if (!position.startsWith('chrome-extension://') || !position.endsWith('.js')) {
        if (position !== '<anonymous>') {
            console.error('MyChromeExtension show loaded js failed, position: ' + position);
        }
    }
    console.log('MyChromeExtension load js: ' + position);
    return position;
};
my_show_loaded_js();



// 在 Console 显示自动输入的密码（需要点一下页面）
var passwords_showed = [];
var my_show_password = function () {
    var passwords = document.querySelectorAll('input[type="password"]');
    for (i = 0; i < passwords.length; i++) {
        var password = passwords[i].value;
        if (password !== '' && passwords_showed.indexOf(password) === -1) {
            console.log('MyChromeExtension show password: ' + password);
            passwords_showed.push(password);
        }
    }
};
my_show_password();
setInterval(my_show_password, 1000);



// 重写 addEventListener，为每个元素记录事件处理函数
var script = document.createElement('script');
script.src = chrome.runtime.getURL('lib/getEventListeners.js');
document.documentElement.appendChild(script);
console.log('MyChromeExtension script.src: ' + script.src);


