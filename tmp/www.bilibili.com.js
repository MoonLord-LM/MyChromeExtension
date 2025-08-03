typeof (showLoadedFile) === 'function' && showLoadedFile();



// 复制链接的按钮
var copyVideoLinkButton = document.createElement('button');
copyVideoLinkButton.id = 'copyVideoLinkButton';
copyVideoLinkButton.textContent = '复制所有视频链接';
Object.assign(copyVideoLinkButton.style, {
  marginLeft: '12px',
  padding: '4px 8px',
  cursor: 'pointer',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#f0f0f0',
  fontSize: '14px'
});

copyVideoLinkButton.addEventListener('click', () => {
  try {
    const links = [...document.querySelectorAll('a')].map(a => a.href).filter(href => href.includes('https://www.bilibili.com/video/'));
    const uniqueLinks = [...new Set(links)];
    if (uniqueLinks.length === 0) {
      alert('未找到视频链接');
      return;
    }
    navigator.clipboard.writeText(uniqueLinks.join('\n')).then(() => alert(`已复制 ${uniqueLinks.length} 个视频链接`)).catch(err => alert('复制失败：' + err));
  } catch (err) {
    alert('处理过程中发生错误：' + err);
  }
});

window.addEventListener('DOMContentLoaded', function () {
  if(!copyVideoLinkButton.parentNode){
    var container = document.querySelector('.video-order-filter');
    if (container) {
      container.appendChild(copyVideoLinkButton);
    } else {
      console.warn('未找到 .video-order-filter 元素');
    }
  }
});

setTimeout(() => {
  if(!copyVideoLinkButton.parentNode){
    var container = document.querySelector('.video-order-filter');
    if (container) {
      container.appendChild(copyVideoLinkButton);
    } else {
      console.warn('未找到 .video-order-filter 元素');
    }
  }
}, 3000);


