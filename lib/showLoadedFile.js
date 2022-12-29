chrome.runtime && console.log('MyChromeExtension load js: ' + chrome.runtime.getURL('lib/showLoadedFile.js'));



// 使用 Error 的 stack，显示已加载的插件 JS 文件名

var showLoadedFile = function () {
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
            return;
        }
    }
    console.log('MyChromeExtension load js: ' + position);
    return position;
};


