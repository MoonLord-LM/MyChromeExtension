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



// 始终允许右键菜单和复制文本
var stopMouseCopyEvent = function (e) { e.stopImmediatePropagation(); return true; };
var stopKeyBoardCopyEvent = function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) { e.stopImmediatePropagation(); } }
var mouseCopyEvents = ['copy', 'select', 'selectstart', 'selectionchange', 'contextmenu', 'dragstart'];
var keyBoardCopyEvents = ['keydown'];
var enableTextSelect = function (root) {
    if (!root) { root = document; }

    var styleHost = root.documentElement || root;
    if (!styleHost.querySelector('#allowTextSelectStyle')) {
        var style = document.createElement('style');
        style.id = 'allowTextSelectStyle';
        style.textContent = `
    * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
    }
`;
        styleHost.appendChild(style);
    }

    var targets = root.defaultView ? [root.defaultView, root] : [root];
    targets.forEach(target => {
        mouseCopyEvents.forEach(event => {
            target.addEventListener(event, stopMouseCopyEvent, true);
        });
        keyBoardCopyEvents.forEach(event => {
            target.addEventListener(event, stopKeyBoardCopyEvent, true);
        });
    });

    root.querySelectorAll('*').forEach(element => {
        if (element.shadowRoot) {
            enableTextSelect(element.shadowRoot);
        }
    });
};
var disableTextSelect = function (root) {
    if (!root) { root = document; }

    var styleHost = root.documentElement || root;
    var style = styleHost.querySelector('#allowTextSelectStyle');
    if (style) {
        style.remove();
    }

    var targets = root.defaultView ? [root.defaultView, root] : [root];
    targets.forEach(target => {
        mouseCopyEvents.forEach(event => {
            target.removeEventListener(event, stopMouseCopyEvent, true);
        });
        keyBoardCopyEvents.forEach(event => {
            target.removeEventListener(event, stopKeyBoardCopyEvent, true);
        });
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



// 始终保持页面活跃焦点状态
var disallowBlurEventFlag = 'MyChromeExtension-disallow-blur-event-flag';
var stopLeaveEvent = function (e) { e.stopImmediatePropagation(); return true; };
var stopVisibilityHiddenEvent = function (e) { if (document.visibilityState === 'hidden') { e.stopImmediatePropagation(); } };
var leaveEvents = ['blur', 'focusout', 'pagehide'];
var visibilityEvents = ['visibilitychange'];
var disallowBlurEvent = function (root) {
    if (!root) { root = document; }

    if (root === document && document.documentElement) {
        document.documentElement.setAttribute(disallowBlurEventFlag, '');
    }

    var targets = root.defaultView ? [root.defaultView, root] : [root];
    targets.forEach(target => {
        leaveEvents.forEach(event => {
            target.addEventListener(event, stopLeaveEvent, true);
        });
        visibilityEvents.forEach(event => {
            target.addEventListener(event, stopVisibilityHiddenEvent, true);
        });
    });

    root.querySelectorAll('*').forEach(element => {
        if (element.shadowRoot) {
            disallowBlurEvent(element.shadowRoot);
        }
    });
};
var allowBlurEvent = function (root) {
    if (!root) { root = document; }

    if (root === document && document.documentElement) {
        document.documentElement.removeAttribute(disallowBlurEventFlag);
    }

    var targets = root.defaultView ? [root.defaultView, root] : [root];
    targets.forEach(target => {
        leaveEvents.forEach(event => {
            target.removeEventListener(event, stopLeaveEvent, true);
        });
        visibilityEvents.forEach(event => {
            target.removeEventListener(event, stopVisibilityHiddenEvent, true);
        });
    });

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
var showPassword = function (root) {
    if (!root) { root = document; }

    root.querySelectorAll('input[type="password"]').forEach(input => {
        input.setAttribute('type', 'passwordShowedByMyChromeExtension');
    });

    root.querySelectorAll('*').forEach(element => {
        if (element.shadowRoot) {
            showPassword(element.shadowRoot);
        }
    });
};
var hidePassword = function (root) {
    if (!root) { root = document; }

    root.querySelectorAll('input[type="passwordShowedByMyChromeExtension"]').forEach(input => {
        input.setAttribute('type', 'password');
    });

    root.querySelectorAll('*').forEach(element => {
        if (element.shadowRoot) {
            hidePassword(element.shadowRoot);
        }
    });
};
chrome.storage.sync.get(['allShowPassword'], data => {
    console.log('chrome.storage.sync.get.allShowPassword: ', data);
    if (data.allShowPassword) {
        document.addEventListener('DOMContentLoaded', function () {
            requestAnimationFrame(function () { showPassword(); });
        });
        showPassword();
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            requestAnimationFrame(function () { hidePassword(); });
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
var limitFontSizeOptions = [8, 10, 12, 14, 16, 18, 20];
var applyLimitFontSize = function (value, root) {
    if (!root) { root = document; }

    var size = Number(value);
    var styleHost = root.documentElement || root;
    var style = styleHost.querySelector('#limitFontSizeStyle');

    if (limitFontSizeOptions.indexOf(size) === -1) {
        if (style) {
            style.remove();
        }
    } else {
        if (!style) {
            style = document.createElement('style');
            style.id = 'limitFontSizeStyle';
            styleHost.appendChild(style);
        }
        style.textContent = `
    * {
        font-size: ${size}px !important;
    }
`;
    }

    root.querySelectorAll('*').forEach(element => {
        if (element.shadowRoot) {
            applyLimitFontSize(value, element.shadowRoot);
        }
    });
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
var applyNoImageMode = function (enabled, root) {
    if (!root) { root = document; }

    var styleHost = root.documentElement || root;
    var style = styleHost.querySelector('#noImageModeStyle');

    if (enabled) {
        if (!style) {
            style = document.createElement('style');
            style.id = 'noImageModeStyle';
            style.textContent = `
    img {
        display: none !important;
        visibility: hidden !important;
    }
    * {
        background-image: none !important;
        border-image: none !important;
    }
`;
            styleHost.appendChild(style);
        }
    } else if (style) {
        style.remove();
    }

    root.querySelectorAll('*').forEach(element => {
        if (element.shadowRoot) {
            applyNoImageMode(enabled, element.shadowRoot);
        }
    });
};
chrome.storage.sync.get(['allNoImageMode'], data => {
    console.log('chrome.storage.sync.get.allNoImageMode: ', data);
    applyNoImageMode(!!data.allNoImageMode);
});
chrome.storage.onChanged.addListener((changes) => {
    if (changes.allNoImageMode) {
        console.log('chrome.storage.onChanged.allNoImageMode: ', changes.allNoImageMode);
        applyNoImageMode(!!changes.allNoImageMode.newValue);
    }
});


