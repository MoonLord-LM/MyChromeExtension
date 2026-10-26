typeof (showLoadedFile) === 'function' && showLoadedFile();



// 初始样式
var hideVideoEndRecommendStyle = document.createElement('style');
hideVideoEndRecommendStyle.id = 'hideVideoEndRecommendStyle';
hideVideoEndRecommendStyle.textContent = `
    div.ytp-ce-element.ytp-ce-element-show.ytp-ce-medium-round {
        display: none !important;
        visibility: hidden !important;
    }
    div.ytp-ce-element.ytp-ce-element-show.ytp-ce-large-round {
        display: none !important;
        visibility: hidden !important;
    }
`;
document.documentElement.appendChild(hideVideoEndRecommendStyle);



// 读取设置
chrome.storage.sync.get(['youtubeHideVideoEndRecommend'], data => {
    console.log('chrome.storage.sync.get.youtubeHideVideoEndRecommend: ', data);
    if (!data.youtubeHideVideoEndRecommend) {
        hideVideoEndRecommendStyle.remove();
    }
});



// 监听设置变化
chrome.storage.onChanged.addListener((changes) => {
    if (changes.youtubeHideVideoEndRecommend) {
        console.log('chrome.storage.onChanged.youtubeHideVideoEndRecommend: ', changes.youtubeHideVideoEndRecommend);
        if (changes.youtubeHideVideoEndRecommend.newValue) {
            document.documentElement.appendChild(hideVideoEndRecommendStyle);
        }
        else {
            hideVideoEndRecommendStyle.remove();
        }
    }
});
