console.log('CleanView : w3.huawei.com.js is loaded');

// 隐藏工号水印
var masks = document.querySelectorAll('div[id^="mask_div"]');
for (i = 0; i < masks.length; i++) {
    masks[i].style.display = 'none';
}
