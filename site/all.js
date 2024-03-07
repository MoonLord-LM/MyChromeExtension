typeof (showLoadedFile) === 'function' && showLoadedFile();



// 将 Lib 中的函数库在页面环境中进行加载
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
            console.log('MyChromeExtension show password: ' + "\n" + password);
            passwords_showed.push(password);
        }
    }
};
showPassword();
setInterval(showPassword, 3000);



// 清除页面的水印（DOM 和 Shadow DOM 中，含有 "mask" 的 div 元素，视作水印）
var script = `
    var originalAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (options) {
        var shadowRoot = originalAttachShadow.apply(this, arguments);
        var originalShadowAppendChild = shadowRoot.appendChild;
        shadowRoot.appendChild = function (child) {
            if (child.tagName && child.tagName.toLowerCase() === 'div') {
                if (child.id && child.id.indexOf("mask") !== -1) {
                    return;
                }
            }
            return originalShadowAppendChild.apply(this, arguments);
        };
        return shadowRoot;
    };
    var originalAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function (child) {
        if (child.tagName && child.tagName.toLowerCase() === 'div') {
            if (child.id && child.id.indexOf("mask") !== -1) {
                return;
            }
        }
        return originalAppendChild.apply(this, arguments);
    };
`;
document.dispatchEvent(new CustomEvent('executeScript', { detail: script }));
var hide_mask = function () {
    var masks = document.querySelectorAll('div[id*="mask"]');
    for (let i = 0; i < masks.length; i++) {
        if (masks[i].style.display !== 'none') {
            masks[i].style.display = 'none';
        }
    }
};
hide_mask();
setInterval(hide_mask, 3000);


