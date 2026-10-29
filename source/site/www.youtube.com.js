typeof (showLoadedFile) === 'function' && showLoadedFile();



// 复制链接的按钮
var copyVideoLinkButton = document.createElement('button');
copyVideoLinkButton.id = 'copyVideoLinkButton';
copyVideoLinkButton.textContent = '复制视频链接';
Object.assign(copyVideoLinkButton.style, {
    position: 'fixed',
    right: '30px',
    bottom: '300px',
    zIndex: '999999',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    background: '#ff0000',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, .25)'
});



// 每次点击都重新扫描当前 DOM，不使用缓存
copyVideoLinkButton.addEventListener('click', async () => {
    var videoIdSet = new Set();
    document.querySelectorAll('a[href]').forEach(a => {
        var match = a.href.match(/^https?:\/\/www\.youtube\.com\/watch\?v=([0-9A-Za-z_-]+)/);
        if (match) {
            videoIdSet.add(match[1]);
        }
    });

    var links = [...videoIdSet].map(id => `https://www.youtube.com/watch?v=${id}`);

    if (links.length === 0) {
        copyVideoLinkButton.textContent = '未找到视频';
        setTimeout(() => { copyVideoLinkButton.textContent = '复制视频链接'; }, 1500);
        return;
    }

    var text = links.join('\n');

    try {
        await navigator.clipboard.writeText(text);
        copyVideoLinkButton.textContent = `已复制 ${links.length} 个`;
        console.log('MyChromeExtension 扫描完成，共找到 ' + links.length + ' 个不同的视频：');
        console.log(text);
    } catch (error) {
        // Clipboard API 失败时使用传统复制方式
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        var success = document.execCommand('copy');
        textarea.remove();
        if (success) {
            copyVideoLinkButton.textContent = `已复制 ${links.length} 个`;
        } else {
            console.log(text);
            copyVideoLinkButton.textContent = '复制失败，请查看 Console';
        }
    }

    setTimeout(() => { copyVideoLinkButton.textContent = '复制视频链接'; }, 2000);
});



// 读取设置
chrome.storage.sync.get(['youtubeCopyVideoLink'], data => {
    console.log('chrome.storage.sync.get.youtubeCopyVideoLink: ', data);
    if (data.youtubeCopyVideoLink) {
        document.body.appendChild(copyVideoLinkButton);
    }
});



// 监听设置变化
chrome.storage.onChanged.addListener((changes) => {
    if (changes.youtubeCopyVideoLink) {
        console.log('chrome.storage.onChanged.youtubeCopyVideoLink: ', changes.youtubeCopyVideoLink);
        if (changes.youtubeCopyVideoLink.newValue) {
            document.body.appendChild(copyVideoLinkButton);
        }
        else {
            copyVideoLinkButton.remove();
        }
    }
});
