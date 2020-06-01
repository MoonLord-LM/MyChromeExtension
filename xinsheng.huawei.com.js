console.log('MyChromeExtension : xinsheng.huawei.com.js is loaded');

// 标签标题拉长
document.title = 'HWSX - ' + document.title;

// 标签 Logo 隐藏
var favicon_href_baidu = 'https://www.baidu.com/favicon.ico';
var favicon = document.querySelector('link[rel="icon"]');
if (favicon === null) {
    favicon = document.querySelector('link[rel="shortcut icon"]');
}
if (favicon === null) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = favicon_href_baidu;
    document.head.appendChild(favicon);
}
favicon.href = favicon_href_baidu;

// 页面灰化
grayscale(document.body);
setInterval(function () {
    grayscale(document.body);
}, 3000);

// 页面 Logo 隐藏
var logos = document.querySelectorAll('img.min-logo');
for (i = 0; i < logos.length; i++) {
    logos[i].style.display = 'none';
}

// 菜单不固定显示
var headers = document.querySelectorAll('div.iframeBox, div.iframeBox div.plate_menu_box');
for (i = 0; i < headers.length; i++) {
    headers[i].style.position = 'static';
}

// 帖子列表隐藏头像
var imgs = document.querySelectorAll('ul li a img');
for (i = 0; i < imgs.length; i++) {
    imgs[i].parentNode.style.display = 'none';
}

// 帖子列表隐藏实名认证标签
var user_icons = document.querySelectorAll('div a span.space_rz');
for (i = 0; i < user_icons.length; i++) {
    user_icons[i].style.display = 'none';
}
var group_icons = document.querySelectorAll('div a span.space_rz_blue');
for (i = 0; i < group_icons.length; i++) {
    group_icons[i].style.display = 'none';
}

// 帖子详情隐藏右侧工具栏
var scrolls = document.querySelectorAll('div.bbsinfoscroll');
for (i = 0; i < scrolls.length; i++) {
    scrolls[i].style.display = 'none';
}
var tools = document.querySelectorAll('div.bottom_tools');
for (i = 0; i < tools.length; i++) {
    tools[i].style.display = 'none';
}
