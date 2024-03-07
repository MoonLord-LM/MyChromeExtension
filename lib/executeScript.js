typeof (showLoadedFile) === 'function' && showLoadedFile();



// Moonlord-LM
// 2022-12-29

// 提供一个自定义的 executeScript 事件处理函数
// 可以在浏览器插件的 JS 环境中创建事件，传递 JS 代码，在页面的 JS 环境中执行

// 示例：
// var script = `alert(123);`
// document.dispatchEvent(new CustomEvent('executeScript', { detail: script }));

document.addEventListener('executeScript', function (e) {
    console.log('executeScript: ' + e.detail);
    eval(e.detail);
});


