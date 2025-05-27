document.addEventListener('DOMContentLoaded', () => {

    // 打印所有的配置
    chrome.storage.sync.get(null, function(data) {
        console.log('chrome.storage.sync.get: ', data);
    });

    // 初始化时读取配置
    chrome.storage.sync.get(['v2exHideBackgroundImage'], data => {
        document.getElementById('v2exHideBackgroundImage').checked = data.v2exHideBackgroundImage || false;
    });
    chrome.storage.sync.get(['v2exHideBackgroundColor'], data => {
        document.getElementById('v2exHideBackgroundColor').checked = data.v2exHideBackgroundColor || false;
    });

    // 实时监听开关变化
    document.getElementById('v2exHideBackgroundImage').addEventListener('change', (e) => {
        chrome.storage.sync.set({ v2exHideBackgroundImage: e.target.checked });
    });
    document.getElementById('v2exHideBackgroundColor').addEventListener('change', (e) => {
        chrome.storage.sync.set({ v2exHideBackgroundColor: e.target.checked });
    });

});
