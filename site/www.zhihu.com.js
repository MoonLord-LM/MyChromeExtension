typeof (showLoadedFile) === 'function' && showLoadedFile();



// 初始样式
var titleFontFixStyle = document.createElement('style');
titleFontFixStyle.id = 'titleFontFixStyle';
titleFontFixStyle.textContent = `
    .QuestionHeader-title {
        font-size: 16px !important;
        font-weight: 400 !important;
    }
`;
document.documentElement.appendChild(titleFontFixStyle);

var wideScreenFixStyle = document.createElement('style');
wideScreenFixStyle.id = 'wideScreenFixStyle';
wideScreenFixStyle.textContent = `
    img {
        max-width: 300px !important;
        margin-left: 0 !important;
    }
    section img {
        max-width: none !important;
        margin-left: 0 !important;
    }
    .Question-mainColumn {
        width: 1250px !important;
    }
    .Question-main {
        width: 1600px !important;
    }
    .Container {
        max-width: 1600px !important;
    }
`;
document.documentElement.appendChild(wideScreenFixStyle);



// 读取设置
chrome.storage.sync.get(['zhihuTitleFontFix'], data => {
    console.log('chrome.storage.sync.get.zhihuTitleFontFix: ', data);
    if (!data.zhihuTitleFontFix) {
        titleFontFixStyle.remove();
    }
});
chrome.storage.sync.get(['zhihuWideScreenFix'], data => {
    console.log('chrome.storage.sync.get.zhihuWideScreenFix: ', data);
    if (!data.zhihuWideScreenFix) {
        wideScreenFixStyle.remove();
    }
});



// 监听设置变化
chrome.storage.onChanged.addListener((changes) => {
    if (changes.zhihuTitleFontFix) {
        console.log('chrome.storage.onChanged.zhihuTitleFontFix: ', changes.zhihuTitleFontFix);
        if (changes.zhihuTitleFontFix.newValue) {
            document.documentElement.appendChild(titleFontFixStyle);
        }
        else {
            titleFontFixStyle.remove();
        }
    }
});
chrome.storage.onChanged.addListener((changes) => {
    if (changes.zhihuWideScreenFix) {
        console.log('chrome.storage.onChanged.zhihuWideScreenFix: ', changes.zhihuWideScreenFix);
        if (changes.zhihuWideScreenFix.newValue) {
            document.documentElement.appendChild(wideScreenFixStyle);
        }
        else {
            wideScreenFixStyle.remove();
        }
    }
});
