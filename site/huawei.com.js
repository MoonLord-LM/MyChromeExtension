typeof (showLoadedFile) === 'function' && showLoadedFile();

// 隐藏工号水印
var hide_mask = function () {
    var masks = document.querySelectorAll('div[id^="mask_div"]');
    var hide_count = 0;
    for (let i = 0; i < masks.length; i++) {
        if(masks[i].style.display !== 'none') {
            masks[i].style.display = 'none';
            hide_count += 1;
        }
    }
    if(hide_count > 0){
        console.log('hide_mask hide_count: ' + hide_count);
    }
    //console.log('hide_mask is running ...');
};
hide_mask();
setInterval(hide_mask, 3000);

// 保存原始的 appendChild 方法
var originalAppendChild = Element.prototype.appendChild;

// 重写 appendChild 方法
Element.prototype.appendChild = function(newChild) {
    if(newChild.parentNode != null){
        console.log("this: " + this);
        console.log("this.id: " + this.id);
        console.log(newChild);
    
        // 获取父级元素
        var parentElement = newChild.parentNode;
        console.log("parentElement: " + parentElement);
        if(parentElement !== null){
            // 获取父级元素的 ID
            var parentId = parentElement.id;
            // 输出父级元素的 ID
            console.log("Parent Element's ID: " + parentId);
        }
    
        // 在这里可以添加你的逻辑，比如检查新添加的子元素类型等
        if (this.id === 'targetElementId') {
            console.log('Appending child to target element is blocked.');
            return; // 阻止添加子元素
        }
        // 如果没有被阻止，调用原始的 appendChild 方法

    }
    return originalAppendChild.apply(this, arguments);
};
