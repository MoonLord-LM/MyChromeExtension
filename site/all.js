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
setInterval(showPassword, 2000);



// 清除页面的水印（DOM 和 Shadow DOM 中，动态添加的含有 "mask" 的 div 元素，视作水印）
{
    var originalAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (options) {
        console.log("options" + options);
        var shadowRoot = originalAttachShadow.apply(this, arguments);
        var originalShadowAppendChild = shadowRoot.appendChild;
        shadowRoot.appendChild = function (child) {
            console.log("child: " + child);
            if (child.tagName !== null && child.tagName.toLowerCase() === 'div') {
                if (child.id !== null && child.id.indexOf("mask") !== -1) {
                    return;
                }
            }
            return originalShadowAppendChild.apply(this, arguments);
        };
        return shadowRoot;
    };
}
{
    var originalAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function (child) {
        console.log("child: " + child);
        if (child.tagName !== null && child.tagName.toLowerCase() === 'div') {
            if (child.id !== null && child.id.indexOf("mask") !== -1) {
                return;
            }
        }
        return originalAppendChild.apply(this, arguments);
    };
}


