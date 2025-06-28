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
        if (config === 'allHideWatermark') {
            // 特殊处理水印白名单开关
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                var currentTab = tabs[0];
                if (currentTab && currentTab.url) {
                    try {
                        var url = new URL(currentTab.url);
                        var hostname = url.hostname;
                        
                        chrome.storage.sync.get(['allHideWatermarkSites'], data => {
                            var whitelist = data.allHideWatermarkSites || [];
                            var element = document.getElementById(config);
                            if (element) {
                                // 获取当前域名的所有父域名
                                const domainParts = hostname.split('.');
                                const parentDomains = [];
                                for (let i = 1; i < domainParts.length - 1; i++) {
                                    parentDomains.push(domainParts.slice(i).join('.'));
                                }

                                // 检查是否有任何适用的例外规则
                                const hasException = whitelist.some(domain => {
                                    if (!domain.startsWith('!')) return false;
                                    const exceptionDomain = domain.slice(1); // 移除 '!' 前缀
                                    return hostname === exceptionDomain || 
                                           hostname.endsWith('.' + exceptionDomain);
                                });

                                if (hasException) {
                                    // 如果有适用的例外规则，检查是否有更具体的允许规则
                                    element.checked = whitelist.some(domain => {
                                        if (domain.startsWith('!')) return false;
                                        // 只有完全匹配或更具体的域名才能覆盖例外规则
                                        if (hostname === domain) return true;
                                        // 检查是否是被例外的域名的子域名，且在白名单中有明确允许
                                        const domainParts = domain.split('.');
                                        const exceptionParts = hostname.split('.');
                                        return exceptionParts.length > domainParts.length && 
                                               hostname.endsWith('.' + domain);
                                    });
                                } else {
                                    // 如果没有适用的例外规则，检查是否有匹配规则
                                    element.checked = whitelist.some(domain => {
                                        if (domain.startsWith('!')) return false;
                                        return hostname === domain || 
                                               (hostname.endsWith('.' + domain) && 
                                                hostname.charAt(hostname.length - domain.length - 1) === '.');
                                    });
                                }
                            }
                        });
                    } catch (error) {
                        console.error('Error processing URL:', currentTab.url, error);
                    }
                }
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
    
    // 特殊处理白名单配置
    chrome.storage.sync.get(['allHideWatermarkSites'], (data) => {
        if (data.allHideWatermarkSites) {
            var element = document.getElementById('allHideWatermarkSites');
            if (element) {
                var textValue = data.allHideWatermarkSites.join('\n') + (data.allHideWatermarkSites.length > 0 ? '\n' : '');
                element.value = textValue;
            }
        }
    });

    // 监听界面操作
    configAndSites.forEach((site, config) => {
        var element = document.getElementById(config);
        if (element) {
            if (config === 'allHideWatermark') {
                // 特殊处理水印白名单开关
                element.addEventListener('change', (e) => {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        var currentTab = tabs[0];
                        if (currentTab && currentTab.url) {
                            try {
                                var url = new URL(currentTab.url);
                                var hostname = url.hostname;
                                
                                chrome.storage.sync.get(['allHideWatermarkSites'], (data) => {
                                    var whitelist = data.allHideWatermarkSites || [];
                                    
                                    // 获取当前域名的所有父域名
                                    const domainParts = hostname.split('.');
                                    const parentDomains = [];
                                    for (let i = 1; i < domainParts.length - 1; i++) {
                                        parentDomains.push(domainParts.slice(i).join('.'));
                                    }

                                    // 检查是否有任何适用的例外规则
                                    const hasException = whitelist.some(domain => {
                                        if (!domain.startsWith('!')) return false;
                                        const exceptionDomain = domain.slice(1); // 移除 '!' 前缀
                                        return hostname === exceptionDomain || 
                                               hostname.endsWith('.' + exceptionDomain);
                                    });

                                    // 检查是否有父域名在列表中
                                    const parentInList = whitelist.find(domain => {
                                        if (domain.startsWith('!')) return false;
                                        return domain !== hostname && hostname.endsWith('.' + domain);
                                    });

                                    if (e.target.checked) {
                                        // 移除当前域名的例外规则（如果存在）
                                        whitelist = whitelist.filter(domain => domain !== `!${hostname}`);

                                        // 如果当前域名在例外规则的影响范围内，需要明确添加当前域名
                                        if (hasException || !parentInList) {
                                            // 检查是否已经有父域名在列表中
                                            const parentDomain = parentInList || whitelist.find(domain => {
                                                if (domain.startsWith('!')) return false;
                                                return hostname.endsWith('.' + domain);
                                            });
                                            
                                            // 如果有父域名，不添加当前域名（使用父域名的配置）
                                            if (!parentDomain && !whitelist.includes(hostname)) {
                                                whitelist.push(hostname);
                                            }
                                        }

                                        // 如果当前域名是一个被例外的域名的子域名，移除相关的例外规则
                                        whitelist = whitelist.filter(domain => {
                                            if (!domain.startsWith('!')) return true;
                                            const exceptionDomain = domain.slice(1);
                                            return !(hostname.endsWith('.' + exceptionDomain));
                                        });
                                    } else {
                                        // 移除当前域名（如果存在）
                                        whitelist = whitelist.filter(domain => domain !== hostname);
                                        
                                        // 移除当前域名的排除规则（如果存在）
                                        whitelist = whitelist.filter(domain => domain !== `!${hostname}`);

                                        // 如果父域名在列表中且没有更高级的例外规则，添加例外规则
                                        if (parentInList && !hasException) {
                                            whitelist.push(`!${hostname}`);
                                        }

                                        // 移除当前域名下的所有子域名
                                        whitelist = whitelist.filter(domain => {
                                            // 保留与当前域名无关的排除规则
                                            if (domain.startsWith('!')) {
                                                const exceptionDomain = domain.slice(1);
                                                return !exceptionDomain.endsWith('.' + hostname) && exceptionDomain !== hostname;
                                            }
                                            return !domain.endsWith('.' + hostname);
                                        });
                                    }
                                    
                                    // 去重，保留第一次出现的规则
                                    whitelist = Array.from(new Set(whitelist));
                                    
                                    console.log('chrome.storage.sync.set.allHideWatermarkSites: ', whitelist);
                                    chrome.storage.sync.set({
                                        allHideWatermarkSites: whitelist
                                    });
                                });
                            } catch (error) {
                                console.error('Error processing URL:', currentTab.url, error);
                            }
                        }
                    });
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
    var element = document.getElementById('allHideWatermarkSites');
    if (element) {
        // 定义一个函数来处理文本框内容变化
        const handleTextareaChange = () => {
            var update = element.value.split('\n');
            update = Array.from(new Set(update)).map(o => o.trim()).filter(o => o.length > 0);
            console.log('chrome.storage.sync.set.allHideWatermarkSites: ', update);
            var textValue = update.join('\n') + (update.length > 0 ? '\n' : '');
            element.value = textValue;
            chrome.storage.sync.set({
                allHideWatermarkSites: update
            });
            
            // 同步更新 allHideWatermark 复选框状态
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                var currentTab = tabs[0];
                if (currentTab && currentTab.url) {
                    try {
                        var url = new URL(currentTab.url);
                        var hostname = url.hostname;
                        var checkboxElement = document.getElementById('allHideWatermark');
                        if (checkboxElement) {
                            // 获取当前域名的所有父域名
                            const domainParts = hostname.split('.');
                            const parentDomains = [];
                            for (let i = 1; i < domainParts.length - 1; i++) {
                                parentDomains.push(domainParts.slice(i).join('.'));
                            }

                            // 检查是否有任何适用的例外规则
                            const hasException = update.some(domain => {
                                if (!domain.startsWith('!')) return false;
                                const exceptionDomain = domain.slice(1); // 移除 '!' 前缀
                                return hostname === exceptionDomain || 
                                       hostname.endsWith('.' + exceptionDomain);
                            });

                            if (hasException) {
                                // 如果有适用的例外规则，检查是否有更具体的允许规则
                                checkboxElement.checked = update.some(domain => {
                                    if (domain.startsWith('!')) return false;
                                    // 只有完全匹配或更具体的域名才能覆盖例外规则
                                    if (hostname === domain) return true;
                                    // 检查是否是被例外的域名的子域名，且在白名单中有明确允许
                                    const domainParts = domain.split('.');
                                    const exceptionParts = hostname.split('.');
                                    return exceptionParts.length > domainParts.length && 
                                           hostname.endsWith('.' + domain);
                                });
                            } else {
                                // 如果没有适用的例外规则，检查是否有匹配规则
                                checkboxElement.checked = update.some(domain => {
                                    if (domain.startsWith('!')) return false;
                                    return hostname === domain || 
                                           (hostname.endsWith('.' + domain) && 
                                            hostname.charAt(hostname.length - domain.length - 1) === '.');
                                });
                            }
                        }
                    } catch (error) {
                        console.error('Error processing URL:', currentTab.url, error);
                    }
                }
            });
        };
        
        // 监听 change 事件（失去焦点时触发）
        element.addEventListener('change', handleTextareaChange);
        
        // 监听 input 事件（输入时触发，提供更实时的反馈）
        element.addEventListener('input', handleTextareaChange);
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
            
            // 特殊处理 allHideWatermarkSites 变化时更新 allHideWatermark 复选框
            if (key === 'allHideWatermarkSites') {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    var currentTab = tabs[0];
                    if (currentTab && currentTab.url) {
                        try {
                            var url = new URL(currentTab.url);
                            var hostname = url.hostname;
                            var checkboxElement = document.getElementById('allHideWatermark');
                            if (checkboxElement) {
                                // 获取当前域名的所有父域名
                                const domainParts = hostname.split('.');
                                const parentDomains = [];
                                for (let i = 1; i < domainParts.length - 1; i++) {
                                    parentDomains.push(domainParts.slice(i).join('.'));
                                }

                                // 检查是否有任何适用的例外规则
                                const hasException = newValue.some(domain => {
                                    if (!domain.startsWith('!')) return false;
                                    const exceptionDomain = domain.slice(1); // 移除 '!' 前缀
                                    return hostname === exceptionDomain || 
                                           hostname.endsWith('.' + exceptionDomain);
                                });

                                if (hasException) {
                                    // 如果有适用的例外规则，检查是否有更具体的允许规则
                                    checkboxElement.checked = newValue.some(domain => {
                                        if (domain.startsWith('!')) return false;
                                        // 只有完全匹配或更具体的域名才能覆盖例外规则
                                        if (hostname === domain) return true;
                                        // 检查是否是被例外的域名的子域名，且在白名单中有明确允许
                                        const domainParts = domain.split('.');
                                        const exceptionParts = hostname.split('.');
                                        return exceptionParts.length > domainParts.length && 
                                               hostname.endsWith('.' + domain);
                                    });
                                } else {
                                    // 如果没有适用的例外规则，检查是否有匹配规则
                                    checkboxElement.checked = newValue.some(domain => {
                                        if (domain.startsWith('!')) return false;
                                        return hostname === domain || 
                                               (hostname.endsWith('.' + domain) && 
                                                hostname.charAt(hostname.length - domain.length - 1) === '.');
                                    });
                                }
                            }
                        } catch (error) {
                            console.error('Error processing URL:', currentTab.url, error);
                        }
                    }
                });
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