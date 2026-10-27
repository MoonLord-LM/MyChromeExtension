document.addEventListener('DOMContentLoaded', () => {

    function checkPageAndUpdateUI() {
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
    }

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
      ['allShowPassword', '*'],
      ['allLimitFontSize', '*'],
      ['allNoImageMode', '*']
    ]);

    // 获取所有配置项的数组（用于向后兼容）
    var configs = Array.from(configAndSites.keys());

    // 统一字体大小的可选值
    var limitFontSizeOptions = [8, 10, 12, 14, 16, 18, 20];
    var updateLimitFontSizeUI = function (value) {
        var size = limitFontSizeOptions.indexOf(Number(value)) === -1 ? 0 : Number(value);
        var element = document.getElementById('allLimitFontSize');
        if (element) {
            element.checked = size > 0;
        }
        var optionsElement = document.getElementById('allLimitFontSizeOptions');
        if (optionsElement) {
            optionsElement.classList.toggle('disabled', size === 0);
            optionsElement.querySelectorAll('.font-size-option').forEach(option => {
                option.classList.toggle('active', Number(option.dataset.size) === size);
            });
        }
    };

    // 加载并展示配置
    configs.forEach(config => {
        if (config === 'allLimitFontSize') {
            chrome.storage.sync.get([config], data => {
                updateLimitFontSizeUI(data[config]);
            });
        } else {
            chrome.storage.sync.get([config], data => {
                var element = document.getElementById(config);
                if (element) {
                    element.checked = data[config] || false;
                }
            });
        }
    });

    // 监听界面操作
    configAndSites.forEach((site, config) => {
        var element = document.getElementById(config);
        if (element) {
            if (config === 'allLimitFontSize') {
                element.addEventListener('change', (e) => {
                    var value = e.target.checked ? 14 : 0;
                    console.log('chrome.storage.sync.set.allLimitFontSize: ', value);
                    chrome.storage.sync.set({ allLimitFontSize: value });
                });
            } else {
                element.addEventListener('change', (e) => {
                    var update = {};
                    update[config] = e.target.checked;
                    console.log('chrome.storage.sync.set.' + config + ': ', e.target.checked);
                    chrome.storage.sync.set(update);
                });
            }
        }
    });
    var limitFontSizeOptionsElement = document.getElementById('allLimitFontSizeOptions');
    if (limitFontSizeOptionsElement) {
        limitFontSizeOptionsElement.querySelectorAll('.font-size-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                var value = Number(option.dataset.size);
                console.log('chrome.storage.sync.set.allLimitFontSize: ', value);
                chrome.storage.sync.set({ allLimitFontSize: value });
            });
        });
    }

    // 监听配置变化
    chrome.storage.onChanged.addListener((changes) => {
        Object.entries(changes).forEach(([key, { newValue }]) => {
            if (key === 'allLimitFontSize') {
                updateLimitFontSizeUI(newValue);
                return;
            }
            var element = document.getElementById(key);
            if (element) {
                if (element.nodeName.toLocaleLowerCase() === 'input' && element.type === 'checkbox') {
                    element.checked = !!newValue;
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
            update.allLimitFontSize = 0;
            console.log('chrome.storage.sync.set: ', update);
            chrome.storage.sync.set(update);
        });
    }

});