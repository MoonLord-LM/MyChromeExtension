my_show_loaded_js();

// 菜单不固定显示
var headers = document.querySelectorAll('header.AppHeader, div.PageHeader');
for (i = 0; i < headers.length; i++) {
    headers[i].style.position = 'static';
}
