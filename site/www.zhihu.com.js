typeof (showLoadedFile) === 'function' && showLoadedFile();



// 顶部菜单不固定显示
var headers = document.querySelectorAll('header.AppHeader, div.PageHeader');
for (let i = 0; i < headers.length; i++) {
    headers[i].style.position = 'static';
}

// 右侧信息不显示
var side = document.querySelector('div.Question-sideColumn');
if(side !== null){
    side.style.display = 'none';
}


