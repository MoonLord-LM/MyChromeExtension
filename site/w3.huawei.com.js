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

// 不限制富文本框的高度
var unlimit_richtext_height = function () {
    var richtexts = document.querySelectorAll('div.richText');
    var unlimit_count = 0;
    for (i = 0; i < richtexts.length; i++) {
        if(richtexts[i].style.maxHeight !== 'none'){
            richtexts[i].style.maxHeight = 'none';
            unlimit_count += 1;
        }
    }
    if(unlimit_count > 0){
        console.log('unlimit_richtext_height unlimit_count: ' + unlimit_count);
    }
    //console.log('unlimit_richtext_height is running ...');
};
unlimit_richtext_height();
setInterval(unlimit_richtext_height, 3000);
