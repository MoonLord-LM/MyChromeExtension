typeof (showLoadedFile) === 'function' && showLoadedFile();



// 提供 executeScript 方法，可以在浏览器插件的 JS 环境中通过事件来传递 JS 代码，让代码在页面的 JS 环境中执行

/*
示例：
var script = `alert(123);`
document.dispatchEvent(new CustomEvent('executeScript', { detail: script }));
*/



document.addEventListener('executeScript', function (e) {
    console.log('MyChromeExtension executeScript: ' + e.detail);
    eval(e.detail);
});


