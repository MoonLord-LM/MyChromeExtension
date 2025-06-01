typeof (showLoadedFile) === 'function' && showLoadedFile();



// 将 Lib 中的函数库在页面的 JS 环境中进行加载
var scriptFiles = [
    'common/getEventListeners.js',
    'common/executeScript.js',
];
for (let i = 0; i < scriptFiles.length; i++) {
    var script = document.createElement('script');
    script.src = chrome.runtime.getURL(scriptFiles[i]);
    document.documentElement.appendChild(script);
}



// 允许选中和复制文本
var allowTextSelectStyle = document.createElement('style');
allowTextSelectStyle.textContent = `
    * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
    }
`;

var mouseCopyEvents = ['copy', 'select', 'selectstart', 'selectionchange', 'contextmenu', 'dragstart'];
var keyBoardCopyEvents = ['keydown'];
var stopMouseEvent = function (e) { e.stopImmediatePropagation(); return true; };
var stopKeyBoardEvent = function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) { e.stopImmediatePropagation(); } }

var enableTextSelect = function (root) {
    if (!root) { root = document; }

    root.documentElement.appendChild(allowTextSelectStyle);
    mouseCopyEvents.forEach(event => {
        root.addEventListener(event, stopMouseEvent, true);
    });
    keyBoardCopyEvents.forEach(event => {
        root.addEventListener(event, stopKeyBoardEvent, true);
    });

    root.querySelectorAll('*').forEach(element => {
        if (element.shadowRoot) {
            enableTextSelect(element.shadowRoot);
        }
    });
};
var disableTextSelect = function (root) {
    if (!root) { root = document; }

    allowTextSelectStyle.remove();
    mouseCopyEvents.forEach(event => {
        root.removeEventListener(event, stopMouseEvent, true);
    });
    keyBoardCopyEvents.forEach(event => {
        root.removeEventListener(event, stopKeyBoardEvent, true);
    });

    root.querySelectorAll('*').forEach(element => {
        if (element.shadowRoot) {
            disableTextSelect(element.shadowRoot);
        }
    });
};
chrome.storage.sync.get(['allAllowTextSelect'], data => {
    console.log('chrome.storage.sync.get.allAllowTextSelect: ', data);
    if (data.allAllowTextSelect) {
        enableTextSelect();
    } else {
        disableTextSelect();
    }
});
chrome.storage.onChanged.addListener((changes) => {
    if (changes.allAllowTextSelect) {
        console.log('chrome.storage.onChanged.allAllowTextSelect: ', changes.allAllowTextSelect);
        if (changes.allAllowTextSelect.newValue) {
            enableTextSelect();
        } else {
            disableTextSelect();
        }
    }
});



// 禁止检测失焦事件
var disallowBlurEvent = function (root) {
    if (!root) { root = document; }

    root.addEventListener('blur', stopMouseEvent, true);

    root.querySelectorAll('*').forEach(element => {
        if (element.shadowRoot) {
            disallowBlurEvent(element.shadowRoot);
        }
    });
};
var allowBlurEvent = function (root) {
    if (!root) { root = document; }

    root.removeEventListener('blur', stopMouseEvent, true);

    root.querySelectorAll('*').forEach(element => {
        if (element.shadowRoot) {
            allowBlurEvent(element.shadowRoot);
        }
    });
};
chrome.storage.sync.get(['allDisallowBlurEvent'], data => {
    console.log('chrome.storage.sync.get.allDisallowBlurEvent: ', data);
    if (data.allDisallowBlurEvent) {
        disallowBlurEvent();
    } else {
        allowBlurEvent();
    }
});
chrome.storage.onChanged.addListener((changes) => {
    if (changes.allDisallowBlurEvent) {
        console.log('chrome.storage.onChanged.allDisallowBlurEvent: ', changes.allDisallowBlurEvent);
        if (changes.allDisallowBlurEvent.newValue) {
            disallowBlurEvent();
        } else {
            allowBlurEvent();
        }
    }
});



// 清除页面的水印（隐藏 Shadow Root 元素，隐藏 ID 为 “maskDiv” 开头的元素）
// 白名单：B 站视频评论 bili-comments
var hideWatermark = function () {
    document.querySelectorAll('*').forEach(element => {
        if (element.shadowRoot && element.nodeName.toLocaleLowerCase() !== 'bili-comments') {
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
        if (element.shadowRoot && element.nodeName.toLocaleLowerCase() !== 'bili-comments') {
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
            if (element.nodeType === 1 && element.shadowRoot && element.nodeName.toLocaleLowerCase() !== 'bili-comments') {
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



// 添加 executeScript 事件，参考 executeScript.js 文件里的实现
document.executeScript = function (script) {
    document.dispatchEvent(new CustomEvent('executeScriptType', { detail: script }));
};


