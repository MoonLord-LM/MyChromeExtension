console.log('MyChromeExtension : w3.huawei.com.js is loaded');

// 隐藏工号水印
var hide_mask = function () {
    var masks = document.querySelectorAll('div[id^="mask_div"]');
    var hide_count = 0;
    for (i = 0; i < masks.length; i++) {
        if(masks[i].style.display !== 'none'){
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
