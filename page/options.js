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
        'allAllowMouseInteract',
        'allHideWatermark',
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

    // 监听配置变化
    chrome.storage.onChanged.addListener((changes) => {
        Object.entries(changes).forEach(([key, { newValue }]) => {
            var element = document.getElementById(key);
            if (element) {
                element.checked = !!newValue;
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
            update['allShowPassword'] = false;
            console.log('chrome.storage.sync.set: ', update);
            chrome.storage.sync.set(update);
        });
    }

});
