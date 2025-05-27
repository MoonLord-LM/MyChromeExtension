document.addEventListener('DOMContentLoaded', () => {

    // 打印所有配置
    chrome.storage.sync.get(null, function (data) {
        console.log('chrome.storage.sync.get: ', data);
    });

    // 配置清单
    const configs = [
        'v2exHideBackgroundImage', 'v2exHideBackgroundColor',
        'allShowPlainPassword', 'allHideWatermark'
    ];

    // 加载并展示配置
    configs.forEach(config => {
        chrome.storage.sync.get([config], data => {
            const element = document.getElementById(config);
            if (element) {
                element.checked = data[config] || false;
            }
        });
    });

    // 监听配置变化
    configs.forEach(config => {
        const element = document.getElementById(config);
        if (element) {
            element.addEventListener('change', (e) => {
                const update = {};
                update[config] = e.target.checked;
                console.log('chrome.storage.sync.set.' + config + ': ', e.target.checked);
                chrome.storage.sync.set(update);
            });
        }
    });

    // 监听界面变化
    chrome.storage.onChanged.addListener((changes) => {
        Object.entries(changes).forEach(([key, { newValue }]) => {
            const element = document.getElementById(key);
            if (element) {
                element.checked = !!newValue;
            }
        });
    });

    // 显示所有密码
    document.getElementById('showAllPassword').addEventListener('click', (e) => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'showAllPassword' });
        });
    });

    // 隐藏所有密码
    document.getElementById('hideAllPassword').addEventListener('click', (e) => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'hideAllPassword' });
        });
    });

    // 停用所有功能
    document.getElementById('clearAllConfig').addEventListener('click', (e) => {
        chrome.storage.sync.clear();
    });

    // 启用所有功能
    document.getElementById('resetAllConfig').addEventListener('click', (e) => {
        const update = {};
        configs.forEach(config => {
            update[config] = true;
        });
        chrome.storage.sync.set(update);
    });

});
