typeof(showLoadedFile) === 'function' && showLoadedFile();



// 为页面 JS 加载 Lib 函数

var scriptFiles = [
    'lib/showLoadedFile.js',
    'lib/getEventListeners.js',
    'lib/showPassword.js'
];
for (let i = 0; i < scriptFiles.length; i++) {
    var script = document.createElement('script');
    script.src = chrome.runtime.getURL(scriptFiles[i]);
    document.documentElement.appendChild(script);
}


