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
var stopKeyBoardEvent = function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) { e.stopImmediatePropagation(); } }

var enableTextSelect = function (root) {
    if (!root) { root = document; }
    if (!root.documentElement) { return; }

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



// 统一字体大小
var limitFontSizeStyle = document.createElement('style');
limitFontSizeStyle.id = 'limitFontSizeStyle';
limitFontSizeStyle.textContent = `
    * {
        font-size: 14px !important;
    }
`;
chrome.storage.sync.get(['allLimitFontSize'], data => {
    console.log('chrome.storage.sync.get.allLimitFontSize: ', data);
    if (data.allLimitFontSize) {
        if (!document.documentElement.contains(limitFontSizeStyle)) {
            document.documentElement.appendChild(limitFontSizeStyle);
        }
    } else {
        limitFontSizeStyle.remove();
    }
});
chrome.storage.onChanged.addListener((changes) => {
    if (changes.allLimitFontSize) {
        console.log('chrome.storage.onChanged.allLimitFontSize: ', changes.allLimitFontSize);
        if (changes.allLimitFontSize.newValue) {
            if (!document.documentElement.contains(limitFontSizeStyle)) {
                document.documentElement.appendChild(limitFontSizeStyle);
            }
        } else {
            limitFontSizeStyle.remove();
        }
    }
});



// 清除页面的水印（隐藏 Shadow Root 元素，隐藏 ID 为 “mask” 开头的元素）
var hideWatermark = function () {
    document.querySelectorAll('*').forEach(element => {
        if (element.shadowRoot) {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            console.log('hideWatermark 1: ', element);
        }
    });
    document.querySelectorAll('[id^="mask"]:not([style*="display: none"]):not([style*="visibility: hidden"])').forEach(element => {
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
    document.querySelectorAll('[id^="mask"]:not([style*="display: block"]):not([style*="visibility: visible"])').forEach(element => {
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
    document.querySelectorAll('[id^="mask"]:not([style*="display: none"]):not([style*="visibility: hidden"])').forEach(element => {
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        console.log('hideWatermarkObserver 2: ', element);
    });
});
// 检查域名是否匹配规则，并处理多级配置和排除规则
var checkDomainRules = function(rules) {
    const currentHostname = window.location.hostname;
    let matchedRules = [];
    
    // 去重规则，保留第一次出现的规则
    const uniqueRules = Array.from(new Set(rules));
    
    // 找出所有匹配的规则
    uniqueRules.forEach(rule => {
        let domain = rule;
        let isExcluded = false;
        
        // 处理排除规则（以 ! 开头的域名）
        if (domain.startsWith('!')) {
            domain = domain.substring(1);
            isExcluded = true;
        }
        
        // 检查当前域名是否匹配规则
        // 确保只有完全匹配或者是子域名才会被匹配
        if (currentHostname === domain || 
            currentHostname.endsWith('.' + domain) && 
            currentHostname.charAt(currentHostname.length - domain.length - 1) === '.') {
            matchedRules.push({
                rule: rule,
                domain: domain,
                isExcluded: isExcluded,
                length: domain.length, // 用于后续比较长度
                index: rules.indexOf(rule) // 保存原始规则在列表中的位置
            });
        }
    });
    
    // 如果没有匹配的规则，返回默认值（不在白名单中）
    if (matchedRules.length === 0) {
        return false;
    }
    
    // 首先按域名长度降序排序
    matchedRules.sort((a, b) => {
        // 如果长度相同，按原始位置排序（较早的规则优先）
        if (b.length === a.length) {
            return a.index - b.index;
        }
        return b.length - a.length;
    });
    
    // 返回最长匹配的规则是否为排除规则
    // 如果是排除规则，返回false（不在白名单中）
    // 如果不是排除规则，返回true（在白名单中）
    return !matchedRules[0].isExcluded;
};

chrome.storage.sync.get(['allHideWatermarkSites'], data => {
    console.log('chrome.storage.sync.get.allHideWatermarkSites: ', data);
    var whitelist = data.allHideWatermarkSites || [];
    var inWhitelist = checkDomainRules(whitelist);
    if (inWhitelist) {
        document.addEventListener('DOMContentLoaded', function () {
            requestAnimationFrame(hideWatermark);
        });
        hideWatermark();
        hideWatermarkObserver.observe(document.documentElement, { childList: true, subtree: true });
    } else {
        hideWatermarkObserver.disconnect();
        document.addEventListener('DOMContentLoaded', function () {
            requestAnimationFrame(showWatermark);
        });
        showWatermark();
    }
});
chrome.storage.onChanged.addListener((changes) => {
    if (changes.allHideWatermarkSites) {
        console.log('chrome.storage.onChanged.allHideWatermarkSites: ', changes.allHideWatermarkSites);
        var whitelist = changes.allHideWatermarkSites.newValue || [];
        var inWhitelist = checkDomainRules(whitelist);
        if (inWhitelist) {
            hideWatermark();
            hideWatermarkObserver.observe(document.documentElement, { childList: true, subtree: true });
        } else {
            hideWatermarkObserver.disconnect();
            showWatermark();
        }
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