chrome.runtime && console.log('MyChromeExtension load js: ' + chrome.runtime.getURL('lib/showLoadedFile.js'));



// Moonlord-LM
// 2022-12-29

// 使用 Error 的 stack，显示已加载的插件 JS 文件名
// 在页面的 JS 环境和浏览器插件的 JS 环境都可以引入使用

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
    console.log('document.currentScript.src: ' + document.currentScript.src);
    return position;
};


