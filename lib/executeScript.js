typeof (showLoadedFile) === 'function' && showLoadedFile();



// 提供 executeScript 方法，可以在浏览器插件的 JS 环境中通过事件来传递 JS 代码，让代码在页面的 JS 环境中执行

// TODO
/*
示例：
var script = `alert(123);`
document.executeScript && document.executeScript(script); // 写法 1
document.dispatchEvent(new CustomEvent('executeScriptType', { detail: hide_mask_script })); // 写法 2
*/



document.addEventListener('executeScriptType', function (e) {
    console.log('MyChromeExtension executeScript: ' + e.detail);
    // const script = document.createElement('script');
    // script.textContent = e.detail;
    // (document.head || document.documentElement).appendChild(script);
    eval(script);
});
document.executeScript = function (script) {
    document.dispatchEvent(new CustomEvent('executeScriptType', { detail: script }));
};


