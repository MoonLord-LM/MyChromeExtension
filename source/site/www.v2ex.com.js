typeof (showLoadedFile) === 'function' && showLoadedFile();



// 初始样式
var hideLogoStyle = document.createElement('style');
hideLogoStyle.id = 'hideLogoStyle';
hideLogoStyle.textContent = `
    #Logo {
        display: none !important;
        visibility: hidden !important;
    }
`;
document.documentElement.appendChild(hideLogoStyle);



// 读取设置
chrome.storage.sync.get(['v2exHideLogo'], data => {
    console.log('chrome.storage.sync.get.v2exHideLogo: ', data);
    if (!data.v2exHideLogo) {
        hideLogoStyle.remove();
    }
});



// 监听设置变化
chrome.storage.onChanged.addListener((changes) => {
    if (changes.v2exHideLogo) {
        console.log('chrome.storage.onChanged.v2exHideLogo: ', changes.v2exHideLogo);
        if (changes.v2exHideLogo.newValue) {
            document.documentElement.appendChild(hideLogoStyle);
        }
        else {
            hideLogoStyle.remove();
        }
    }
});
