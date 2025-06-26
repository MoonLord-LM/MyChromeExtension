typeof (showLoadedFile) === 'function' && showLoadedFile();



// 初始样式
var hideImageStyle = document.createElement('style');
hideImageStyle.id = 'hideImageStyle';
hideImageStyle.textContent = `
    #Wrapper {
        background-image: none !important;
    }
`;
document.documentElement.appendChild(hideImageStyle);

var hideColorStyle = document.createElement('style');
hideColorStyle.id = 'hideColorStyle';
hideColorStyle.textContent = `
    #Wrapper {
        background-color: #e2e2e2 !important;
    }
`;
document.documentElement.appendChild(hideColorStyle);

var hideLogoStyle = document.createElement('style');
hideLogoStyle.id = 'hideLogoStyle';
hideLogoStyle.textContent = `
    #Logo {
        display: none !important;
    }
`;
document.documentElement.appendChild(hideLogoStyle);



// 读取设置
chrome.storage.sync.get(['v2exHideBackgroundImage'], data => {
    console.log('chrome.storage.sync.get.v2exHideBackgroundImage: ', data);
    if (!data.v2exHideBackgroundImage) {
        hideImageStyle.remove();
    }
});
chrome.storage.sync.get(['v2exHideBackgroundColor'], data => {
    console.log('chrome.storage.sync.get.v2exHideBackgroundColor: ', data);
    if (!data.v2exHideBackgroundColor) {
        hideColorStyle.remove();
    }
});
chrome.storage.sync.get(['v2exHideLogo'], data => {
    console.log('chrome.storage.sync.get.v2exHideLogo: ', data);
    if (!data.v2exHideLogo) {
        hideLogoStyle.remove();
    }
});



// 监听设置变化
chrome.storage.onChanged.addListener((changes) => {
    if (changes.v2exHideBackgroundImage) {
        console.log('chrome.storage.onChanged.v2exHideBackgroundImage: ', changes.v2exHideBackgroundImage);
        if (changes.v2exHideBackgroundImage.newValue) {
            document.documentElement.appendChild(hideImageStyle);
        }
        else {
            hideImageStyle.remove();
        }
    }
});
chrome.storage.onChanged.addListener((changes) => {
    if (changes.v2exHideBackgroundColor) {
        console.log('chrome.storage.onChanged.v2exHideBackgroundColor: ', changes.v2exHideBackgroundColor);
        if (changes.v2exHideBackgroundColor.newValue) {
            document.documentElement.appendChild(hideColorStyle);
        }
        else {
            hideColorStyle.remove();
        }
    }
});
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
