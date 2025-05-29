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



// 清除页面的水印（隐藏 Shadow Root 元素，隐藏 ID 为 “maskDiv” 开头的元素）
var hideWatermark = function () {
    document.querySelectorAll('*').forEach(element => {
        if (element.shadowRoot) {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            console.log('hideWatermark 1: ', element);
        }
    });
    document.querySelectorAll('[id^="maskDiv"]:not([style*="display: none"]):not([style*="visibility: hidden"])').forEach(element => {
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        console.log('hideWatermark 2: ', element);
    });
};
var showWatermark = function () {
    document.querySelectorAll('*').forEach(element => {
        if (element.shadowRoot) {
            element.style.display = '';
            element.style.visibility = '';
            console.log('showWatermark 1: ', element);
        }
    });
    document.querySelectorAll('[id^="maskDiv"]:not([style*="display: block"]):not([style*="visibility: visible"])').forEach(element => {
        element.style.display = 'block';
        element.style.visibility = 'visible';
        console.log('showWatermark 2: ', element);
    });
};
var hideWatermarkObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(element => {
            if (element.nodeType === 1 && element.shadowRoot) {
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                console.log('hideWatermarkObserver 1: ', element);
            }
        });
    });
    document.querySelectorAll('[id^="maskDiv"]:not([style*="display: none"]):not([style*="visibility: hidden"])').forEach(element => {
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        console.log('hideWatermarkObserver 2: ', element);
    });
});
chrome.storage.sync.get(['allHideWatermark'], data => {
    console.log('chrome.storage.sync.get.allHideWatermark: ', data);
    if (data.allHideWatermark) {
        hideWatermark();
        hideWatermarkObserver.observe(document.documentElement, { childList: true, subtree: true });
    } else {
        hideWatermarkObserver.disconnect();
        showWatermark();
    }
});
chrome.storage.onChanged.addListener((changes) => {
    if (changes.allHideWatermark) {
        console.log('chrome.storage.onChanged.allHideWatermark: ', changes.allHideWatermark);
        if (changes.allHideWatermark.newValue) {
            hideWatermark();
            hideWatermarkObserver.observe(document.documentElement, { childList: true, subtree: true });
        }
        else {
            hideWatermarkObserver.disconnect();
            showWatermark();
        }
    }
});



// 显示明文密码
var showPassword = function () {
    document.querySelectorAll('input[type="password"]').forEach(input => {
        input.setAttribute('type', 'passwordShowedByMyChromeExtension');
    });
};
var hidePassword = function () {
    document.querySelectorAll('input[type="passwordShowedByMyChromeExtension"]').forEach(input => {
        input.setAttribute('type', 'password');
    });
};
chrome.storage.sync.get(['allShowPassword'], data => {
    console.log('chrome.storage.sync.get.allShowPassword: ', data);
    if (data.allShowPassword) {
        document.addEventListener('DOMContentLoaded', function () {
            requestAnimationFrame(showPassword);
        });
        showPassword();
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            requestAnimationFrame(hidePassword);
        });
        hidePassword();
    }
});
chrome.storage.onChanged.addListener((changes) => {
    if (changes.allShowPassword) {
        console.log('chrome.storage.onChanged.allShowPassword: ', changes.allShowPassword);
        if (changes.allShowPassword.newValue) {
            showPassword();
        }
        else {
            hidePassword();
        }
    }
});
