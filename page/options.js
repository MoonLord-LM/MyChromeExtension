document.addEventListener('DOMContentLoaded', () => {

    // 打印所有配置
    chrome.storage.sync.get(null, function (data) {
        console.log('chrome.storage.sync.get: ', data);
    });

    // 配置清单
    var configs = [
        'v2exHideBackgroundImage',
        'v2exHideBackgroundColor',
        'zhihuTitleFontFix',
        'zhihuWideScreenFix',
        'allAllowTextSelect',
        'allDisallowBlurEvent',
        'allHideWatermark',
        'allLimitFontSize',
        'allNoImageMode',
        'allShowPassword'
    ];

    // 加载并展示配置
    configs.forEach(config => {
        chrome.storage.sync.get([config], data => {
            var element = document.getElementById(config);
            if (element) {
                element.checked = data[config] || false;
            }
        });
        chrome.storage.sync.get(['allHideWatermarkWhitelist'], (data) => {
            if (data.allHideWatermarkWhitelist) {
                var element = document.getElementById('allHideWatermarkWhitelist');
                if (element) {
                    var textValue = data.allHideWatermarkWhitelist.join('\n') + (data.allHideWatermarkWhitelist.length > 0 ? '\n' : '');
                    element.value = textValue;
                }
            }
        });
    });

    // 监听界面操作
    configs.forEach(config => {
        var element = document.getElementById(config);
        if (element) {
            element.addEventListener('change', (e) => {
                var update = {};
                update[config] = e.target.checked;
                console.log('chrome.storage.sync.set.' + config + ': ', e.target.checked);
                chrome.storage.sync.set(update);
            });
        }
    });
    var element = document.getElementById('allHideWatermarkWhitelist');
    if (element) {
        element.addEventListener('change', () => {
            var update = element.value.split('\n');
            update = Array.from(new Set(update)).map(o => o.trim()).filter(o => o.length > 0);
            console.log('chrome.storage.sync.set.allHideWatermarkWhitelist: ', update);
            var textValue = update.join('\n') + (update.length > 0 ? '\n' : '');
            element.value = textValue;
            chrome.storage.sync.set({
                allHideWatermarkWhitelist: update
            });
        });
    }

    // 监听配置变化
    chrome.storage.onChanged.addListener((changes) => {
        Object.entries(changes).forEach(([key, { newValue }]) => {
            var element = document.getElementById(key);
            if (element) {
                if (element.nodeName.toLocaleLowerCase() === 'input' && element.type === 'checkbox') {
                    element.checked = !!newValue;
                }
                else if (element.nodeName.toLocaleLowerCase() === 'textarea') {
                    textValue = newValue.join('\n') + (newValue.length > 0 ? '\n' : '');
                    element.value = textValue;
                }
            }
        });
    });

    // 全部禁用
    var clearAllConfig = document.getElementById('clearAllConfig');
    if (clearAllConfig) {
        clearAllConfig.addEventListener('click', (e) => {
            console.log('chrome.storage.sync.clear');
            chrome.storage.sync.clear();
        });
    }

    // 还原默认
    var resetAllConfig = document.getElementById('resetAllConfig');
    if (resetAllConfig) {
        resetAllConfig.addEventListener('click', (e) => {
            var update = {};
            configs.forEach(config => {
                update[config] = true;
            });
            update['allLimitFontSize'] = false;
            update['allNoImageMode'] = false;
            update['allShowPassword'] = false;
            console.log('chrome.storage.sync.set: ', update);
            chrome.storage.sync.set(update);
        });
    }

});
