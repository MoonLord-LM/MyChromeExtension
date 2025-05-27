typeof (showLoadedFile) === 'function' && showLoadedFile();



// 在 document_start 阶段，先插入初始样式，隐藏背景图/背景色
const hideImageStyle = document.createElement('style');
hideImageStyle.textContent = '#Wrapper { background-image: none !important; }';
document.documentElement.appendChild(hideImageStyle);

const hideColorStyle = document.createElement('style');
hideColorStyle.textContent = '#Wrapper { background-color: #e2e2e2 !important; }';
document.documentElement.appendChild(hideColorStyle);



// 根据设置决定是否展示背景图/背景色
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



// 监听设置变化
chrome.storage.onChanged.addListener((changes) => {
    console.log('chrome.storage.onChanged.v2exHideBackgroundImage: ', changes.v2exHideBackgroundImage);
    if (changes.v2exHideBackgroundImage.newValue) {
        document.documentElement.appendChild(hideImageStyle);
    }
    else {
        hideImageStyle.remove();
    }
});
chrome.storage.onChanged.addListener((changes) => {
    console.log('chrome.storage.onChanged.v2exHideBackgroundColor: ', changes.v2exHideBackgroundColor);
    if (changes.v2exHideBackgroundColor.newValue) {
        document.documentElement.appendChild(hideColorStyle);
    }
    else {
        hideColorStyle.remove();
    }
});
