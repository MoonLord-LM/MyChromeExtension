typeof (showLoadedFile) === 'function' && showLoadedFile();



// 为页面 JS 加载 Lib 函数
var scriptFiles = [
    'lib/showLoadedFile.js',
    'lib/getEventListeners.js',
    'lib/executeScript.js',
];
for (let i = 0; i < scriptFiles.length; i++) {
    var script = document.createElement('script');
    script.src = chrome.runtime.getURL(scriptFiles[i]);
    document.documentElement.appendChild(script);
}



// 在 Console 显示自动输入的密码（需要点一下页面）
var passwords_showed = [];
var showPassword = function () {
    var passwords = document.querySelectorAll('input[type="password"]');
    for (let i = 0; i < passwords.length; i++) {
        var password = passwords[i].value;
        if (password !== '' && passwords_showed.indexOf(password) === -1) {
            console.log('MyChromeExtension show password: ' + password);
            passwords_showed.push(password);
        }
    }
};
showPassword();
setInterval(showPassword, 2000);


