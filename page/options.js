document.addEventListener('DOMContentLoaded', () => {

    checkPageAndUpdateUI = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            var currentTab = tabs[0];
            if(currentTab && currentTab.url){
                try {
                    var url = new URL(currentTab.url);
                    configAndSites.forEach((site, config) => {
                        if (url.protocol === 'chrome-extension:' || site === '*' || url.hostname === site || url.hostname.endsWith('.' + site)) {
                            var element = document.getElementById(config);
                            if (element && element.parentElement) {
                                element.parentElement.style.display = null;
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error processing URL:', currentTab.url, error);
                }
            }
        });
    };

    checkPageAndUpdateUI();
    chrome.tabs.onActivated.addListener(checkPageAndUpdateUI);
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
        if (changeInfo.url) {
            checkPageAndUpdateUI();
        }
    });

    // 打印所有配置
    chrome.storage.sync.get(null, function (data) {
        console.log('chrome.storage.sync.get: ', data);
    });

    // 配置清单
    var configAndSites = new Map([
      ['v2exHideBackgroundImage', 'v2ex.com'],
      ['v2exHideBackgroundColor', 'v2ex.com'],
      ['v2exHideLogo', 'v2ex.com'],
      ['zhihuTitleFontFix', 'zhihu.com'],
      ['zhihuWideScreenFix', 'zhihu.com'],
      ['zhihuHideLogo', 'zhihu.com'],
      ['zhihuReduceLineSpacing', 'zhihu.com'],
      ['youtubeHideVideoEndRecommend', 'youtube.com'],
      ['allAllowTextSelect', '*'],
      ['allDisallowBlurEvent', '*'],
      ['allHideWatermark', '*'],
      ['allLimitFontSize', '*'],
      ['allNoImageMode', '*'],
      ['allShowPassword', '*']
    ]);

    // 获取所有配置项的数组（用于向后兼容）
    var configs = Array.from(configAndSites.keys());

    // 加载并展示配置
    configs.forEach(config => {
        chrome.storage.sync.get([config], data => {
            var element = document.getElementById(config);
            if (element) {
                element.checked = data[config] || false;
            }
        });
    });
    
    // 特殊处理白名单配置
    chrome.storage.sync.get(['allHideWatermarkWhitelist'], (data) => {
        if (data.allHideWatermarkWhitelist) {
            var element = document.getElementById('allHideWatermarkWhitelist');
            if (element) {
                var textValue = data.allHideWatermarkWhitelist.join('\n') + (data.allHideWatermarkWhitelist.length > 0 ? '\n' : '');
                element.value = textValue;
            }
        }
    });

    // 监听界面操作
    configAndSites.forEach((site, config) => {
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
            configAndSites.forEach((site, config) => {
                update[config] = (site !== '*');
            });
            console.log('chrome.storage.sync.set: ', update);
            chrome.storage.sync.set(update);
        });
    }

});
