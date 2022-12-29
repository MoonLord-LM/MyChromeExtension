typeof(showLoadedFile) === 'function' && showLoadedFile();

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
    //console.log('grayscale is running ...');
}, 3000);

// 页面 Logo 隐藏
var logos = document.querySelectorAll('img.min-logo');
for (let i = 0; i < logos.length; i++) {
    if(logos[i].style.display !== 'none') {
        logos[i].style.display = 'none';
    }
}

// 菜单不固定显示
var headers = document.querySelectorAll('div.iframeBox, div.iframeBox div.plate_menu_box');
for (let i = 0; i < headers.length; i++) {
    headers[i].style.position = 'static';
}

// 帖子列表隐藏头像
var imgs = document.querySelectorAll('ul li a img');
for (let i = 0; i < imgs.length; i++) {
    if(logos[i].style.display !== 'none') {
        logos[i].style.display = 'none';
    }
}

// 帖子列表隐藏实名认证标签
var user_icons = document.querySelectorAll('div a span.space_rz');
for (let i = 0; i < user_icons.length; i++) {
    if(user_icons[i].style.display !== 'none') {
        user_icons[i].style.display = 'none';
    }
}
var group_icons = document.querySelectorAll('div a span.space_rz_blue');
for (let i = 0; i < group_icons.length; i++) {
    if(group_icons[i].style.display !== 'none') {
        group_icons[i].style.display = 'none';
    }
}

// 帖子列表修改排版
var html_body = document.querySelector('div.html_body');
if (html_body !== null) {
    html_body.style.width = '100%';
}
var bbs_left = document.querySelector('div.bbs_left');
if (bbs_left !== null) {
    bbs_left.style.width = '100%';
}
var list_titles = document.querySelectorAll('div.bbs_list ul li div.font_box div.title');
for (let i = 0; i < list_titles.length; i++) {
    list_titles[i].style.fontSize = '14px';
}
var list_operates = document.querySelectorAll('div.bbs_list ul li div.font_box div.pro p.pro_operate');
for (let i = 0; i < list_operates.length; i++) {
    list_operates[i].style.float = 'left';
}

// 帖子详情隐藏右侧工具栏
var scrolls = document.querySelectorAll('div.bbsinfoscroll');
for (let i = 0; i < scrolls.length; i++) {
    if(scrolls[i].style.display !== 'none') {
        scrolls[i].style.display = 'none';
    }
}
var tools = document.querySelectorAll('div.bottom_tools');
for (let i = 0; i < tools.length; i++) {
    if(tools[i].style.display !== 'none') {
        tools[i].style.display = 'none';
    }
}
