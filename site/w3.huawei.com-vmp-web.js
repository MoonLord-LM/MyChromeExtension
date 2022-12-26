typeof(my_show_loaded_js) === 'function' && my_show_loaded_js();

// 不限制富文本显示区域的高度
var unlimit_richtext_height = function () {
    var richTexts = document.querySelectorAll('div.richText');
    var unlimit_count = 0;
    for (i = 0; i < richTexts.length; i++) {
        if(richTexts[i].style.maxHeight !== 'none'){
            richTexts[i].style.maxHeight = 'none';
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

// 增加富文本输入框的高度
var increase_edit_height = function () {
    var keEdits = document.querySelectorAll('div.ke-edit');
    var edit_count = 0;
    for (i = 0; i < keEdits.length; i++) {
        if(keEdits[i].style.height !== '300px'){
            keEdits[i].style.height = '300px';
            edit_count += 1;
        }
    }
    if(edit_count > 0){
        console.log('increase_edit_height edit_count: ' + edit_count);
    }
    var keEditIframes = document.querySelectorAll('iframe.ke-edit-iframe');
    var frame_count = 0;
    for (i = 0; i < keEditIframes.length; i++) {
        if(keEditIframes[i].style.height !== '300px'){
            keEditIframes[i].style.height = '300px';
            frame_count += 1;
        }
    }
    if(frame_count > 0){
        console.log('increase_edit_height frame_count: ' + frame_count);
    }
    //console.log('increase_edit_height is running ...');
};
increase_edit_height();
setInterval(increase_edit_height, 3000);
