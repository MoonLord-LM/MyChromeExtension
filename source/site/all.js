// 显示当前加载的 JS 文件路径
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
showLoadedFile();



// 允许选中和复制文本
var allowTextSelectStyle = document.createElement('style');
allowTextSelectStyle.id = 'allowTextSelectStyle';
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
var stopKeyBoardCopyEvent = function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) { e.stopImmediatePropagation(); } }

var enableTextSelect = function (root) {
    if (!root) { root = document; }
    if (!root.documentElement) { return; }

    root.documentElement.appendChild(allowTextSelectStyle);
    mouseCopyEvents.forEach(event => {
        root.addEventListener(event, stopMouseEvent, true);
    });
    keyBoardCopyEvents.forEach(event => {
        root.addEventListener(event, stopKeyBoardCopyEvent, true);
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
        root.removeEventListener(event, stopKeyBoardCopyEvent, true);
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



// 统一字体大小
var limitFontSizeStyle = document.createElement('style');
limitFontSizeStyle.id = 'limitFontSizeStyle';
var limitFontSizeOptions = [8, 10, 12, 14, 16, 18, 20];
var applyLimitFontSize = function (value) {
    var size = Number(value);
    if (limitFontSizeOptions.indexOf(size) === -1) {
        limitFontSizeStyle.remove();
        return;
    }
    limitFontSizeStyle.textContent = `
    * {
        font-size: ${size}px !important;
    }
`;
    if (!document.documentElement.contains(limitFontSizeStyle)) {
        document.documentElement.appendChild(limitFontSizeStyle);
    }
};
chrome.storage.sync.get(['allLimitFontSize'], data => {
    console.log('chrome.storage.sync.get.allLimitFontSize: ', data);
    applyLimitFontSize(data.allLimitFontSize);
});
chrome.storage.onChanged.addListener((changes) => {
    if (changes.allLimitFontSize) {
        console.log('chrome.storage.onChanged.allLimitFontSize: ', changes.allLimitFontSize);
        applyLimitFontSize(changes.allLimitFontSize.newValue);
    }
});



// 无图模式
var noImageModeStyle = document.createElement('style');
noImageModeStyle.id = 'noImageModeStyle';
noImageModeStyle.textContent = `
    img {
        display: none !important;
        visibility: hidden !important;
    }
    * {
        background-image: none !important;
        border-image: none !important;
    }
`;
chrome.storage.sync.get(['allNoImageMode'], data => {
    console.log('chrome.storage.sync.get.allNoImageMode: ', data);
    if (data.allNoImageMode) {
        if (!document.documentElement.contains(noImageModeStyle)) {
            document.documentElement.appendChild(noImageModeStyle);
        }
    } else {
        noImageModeStyle.remove();
    }
});
chrome.storage.onChanged.addListener((changes) => {
    if (changes.allNoImageMode) {
        console.log('chrome.storage.onChanged.allNoImageMode: ', changes.allNoImageMode);
        if (changes.allNoImageMode.newValue) {
            if (!document.documentElement.contains(noImageModeStyle)) {
                document.documentElement.appendChild(noImageModeStyle);
            }
        } else {
            noImageModeStyle.remove();
        }
    }
});


