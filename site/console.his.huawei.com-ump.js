typeof (showLoadedFile) === 'function' && showLoadedFile();

if(window.location.href.startsWith('http://console.his.huawei.com/ump/#/topic') || window.location.href.startsWith('https://console.his.huawei.com/ump/#/topic')){
    // MQS 发布和订阅时，自动选中所有的区域的 CheckBox
    var choose_all_checkbox = function () {
        var checkboxes = document.querySelectorAll('label.ant-checkbox-wrapper span.ant-checkbox input[type="checkbox"].ant-checkbox-input');
        for (let i = 0; i < checkboxes.length; i++) {
            if(checkboxes[i].parentNode.className.indexOf('ant-checkbox-checked') == -1){
                checkboxes[i].click();
            }
        }
        //console.log('choose_all_checkbox is running ...');
    };
    setInterval(choose_all_checkbox, 1000);
}
