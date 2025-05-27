typeof (showLoadedFile) === 'function' && showLoadedFile();



// 将 Lib 中的函数库在页面的 JS 环境中进行加载
var scriptFiles = [
    'lib/getEventListeners.js',
    'lib/executeScript.js',
];
for (let i = 0; i < scriptFiles.length; i++) {
    var script = document.createElement('script');
    script.src = chrome.runtime.getURL(scriptFiles[i]);
    document.documentElement.appendChild(script);
}



// 在 Console 显示自动输入的密码（需要点一下页面；重复的值只显示一次）
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
setInterval(showPassword, 1000);



// 清除页面的水印
var hideMask = function () {
    var masks = document.querySelectorAll('div[id*="mask"]');
    for (let i = 0; i < masks.length; i++) {
        if (masks[i].style.display !== 'none') {
            masks[i].style.display = 'none';
        }
    }
    var watermarks = document.querySelectorAll('div[class*="watermark"]');
    for (let i = 0; i < watermarks.length; i++) {
        for (let j = 0; j < watermarks[i].classList.length; j++) {
            if (watermarks[i].classList[j].indexOf('watermark') !== -1) {
                watermarks[i].classList.remove(watermarks[i].classList[j]);
            }
        }
    }
};
hideMask();
setInterval(hideMask, 1000);



// 显示所有密码
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showAllPassword') {
    document.querySelectorAll('input[type="password"]').forEach(input => {
        input.setAttribute('type', 'passwordShowedByMyChromeExtension');
    });
    }
});

// 隐藏所有密码
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'hideAllPassword') {
    document.querySelectorAll('input[type="passwordShowedByMyChromeExtension"]').forEach(input => {
        input.setAttribute('type', 'password');
    });
    }
});


