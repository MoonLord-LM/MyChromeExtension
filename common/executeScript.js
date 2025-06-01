typeof (showLoadedFile) === 'function' && showLoadedFile();



// 插件的 Content Scripts 有单独的运行环境，与页面存在一定隔离，例如 window 对象是不同的  
// 但是 DOM 树是与页面共享的，即 document 对象是同一个，可以进行读写，修改页面效果 

// 本文件提供一个 executeScript 方法，给浏览器插件的 JS 环境调用
// 通过事件来传递 JS 代码，让代码在页面的 JS 环境中执行

/*
示例写法 1：
var script1 = `alert(123);`
document.executeScript && document.executeScript(script1);

示例写法 2：
var script2 = `alert(456);`
document.dispatchEvent(new CustomEvent('executeScriptType', { detail: script2 }));
*/



document.addEventListener('executeScriptType', function (e) {
    console.log('MyChromeExtension executeScript: ' + e.detail);
    // const script = document.createElement('script');
    // script.textContent = e.detail;
    // (document.head || document.documentElement).appendChild(script);
    eval(e.detail);
    // TODO 待测试最新版 Chrome 的兼容性
});


