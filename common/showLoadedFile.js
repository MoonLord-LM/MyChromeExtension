chrome && chrome.runtime && console.log('MyChromeExtension load js: ' + chrome.runtime.getURL('common/showLoadedFile.js'));



// 提供 showLoadedFile 方法，显示当前加载的 JS 文件路径（通过 Error 的 stack 信息截取）
var getCurrentFile = function () {
    var position = '<anonymous>';
    var error_stack = (new Error).stack.split("\n");
    if (error_stack.length > 1) {
        position = error_stack[error_stack.length - 1].trim();
        if (position.startsWith('at')) {
            position = position.substring(2).trim();
        }
        if (position.indexOf('(') !== -1) {
            position = position.substring(position.indexOf('(') + 1);
        }
        if (position.indexOf(':') !== -1) {
            position = position.substring(0, position.lastIndexOf(':'));
        }
        if (position.indexOf(':') !== -1) {
            position = position.substring(0, position.lastIndexOf(':'));
        }
        if (!position.endsWith('.js') && position !== '<anonymous>') {
            console.error('MyChromeExtension showLoadedFile error, position: ' + position);
        }
    }
    return position;
}
var showLoadedFile = function () {
    console.log('MyChromeExtension load js: ' + getCurrentFile());
};



// 将本文件在页面的 JS 环境中也进行加载
if (chrome && chrome.runtime) {
    var script = document.createElement('script');
    script.src = getCurrentFile();
    document.documentElement.appendChild(script);
}


