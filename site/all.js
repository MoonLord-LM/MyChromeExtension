// 使用 Error 的 stack，显示已加载的插件 JS 文件名
var my_show_loaded_js = function () {
    var error_stack = (new Error).stack.split("\n");
    var position = error_stack[error_stack.length - 1].trim();
    if (position.startsWith('at ')) {
        position = position.substr(3);
    }
    if (position.indexOf('(') !== -1) {
        position = position.substr(position.indexOf('(') + 1);
    }
    if (position.indexOf(':') !== -1) {
        position = position.substr(0, position.lastIndexOf(':'));
    }
    if (position.indexOf(':') !== -1) {
        position = position.substr(0, position.lastIndexOf(':'));
    }
    if (!position.startsWith('chrome-extension://') || !position.endsWith('.js')) {
        if(position !== '<anonymous>') {
            console.error('MyChromeExtension show loaded js failed, position: ' + position);
        }
    }
    console.log('MyChromeExtension load js: ' + position);
    return position;
};
my_show_loaded_js();



// 在 Console 显示自动输入的密码
var passwords_logged = [];
var log_password = function () {
    var passwords = document.querySelectorAll('input[type="password"]');
    for (i = 0; i < passwords.length; i++) {
        var password = passwords[i].value;
        if(password !== '' && passwords_logged.indexOf(password) === -1){
            console.log('password : ' + password);
            passwords_logged.push(password);
        }
    }
    //console.log('log_password is running ...');
};
log_password();
setInterval(log_password, 3000);



// 使用 chrome.storage.sync，保存和同步用户的插件设置
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea

/*
var my_chrome_extension_js_settings = {};

var my_show_storage_usage = function () {
    chrome.storage.sync.getBytesInUse(null, function(data) {
        console.log('MyChromeExtension storage sync usage: ' + data + ' Bytes');
    });
    chrome.storage.sync.get(null, function(data) {
        console.log('MyChromeExtension storage sync load: ' + JSON.stringify(data));
        my_chrome_extension_js_settings = data;
        localStorage.setItem('my_chrome_extension_js_settings', JSON.stringify(my_chrome_extension_js_settings));
    });
};
var my_clear_storage_usage = function () {
    chrome.storage.sync.clear();
};
my_show_storage_usage();

var my_set_js_setting = function (key, value) {
    var js_setting = {};
    js_setting[key] = value;
    var js_file = my_get_loaded_js();
    var data = {};
    data[js_file] = js_setting;
    my_chrome_extension_js_settings[js_file] = js_setting;
    localStorage.setItem('my_chrome_extension_js_settings', JSON.stringify(my_chrome_extension_js_settings));
    chrome.storage.sync.set(data, function() {
        console.log('MyChromeExtension storage sync set ok: ' + JSON.stringify(data));
    });
    console.log('MyChromeExtension my_set_js_setting: ' + JSON.stringify(data));
};

var my_get_js_setting = function (key) {
    chrome.storage.sync.get(null, function(data) {
        console.log('MyChromeExtension storage sync get ok: ' + JSON.stringify(data));
        my_chrome_extension_js_settings = data;
        localStorage.setItem('my_chrome_extension_js_settings', JSON.stringify(my_chrome_extension_js_settings));
    });
    var value = undefined;
    var js_file = my_get_loaded_js();
    var js_setting = my_chrome_extension_js_settings[js_file];
    if(js_setting && js_setting[key]){
        value = js_setting[key];
    }
    else {
        var tmp_settings = JSON.parse(localStorage.getItem('my_chrome_extension_js_settings'));
        if(tmp_settings && tmp_settings[js_file] && tmp_settings[js_file][key]){
            value = tmp_settings[js_file][key];
        }
    }
    var data = {};
    data[key] = value;
    console.log('MyChromeExtension my_get_js_setting: ' + JSON.stringify(data));
    return value;
};

chrome.storage.onChanged.addListener(function(changes, areaName){
    console.log('MyChromeExtension storage ' + areaName + ' changed: ' + JSON.stringify(changes));
    // {"chrome-extension://iklbhcbmbooeeckkjljbmoekngggplbd/site/all.js":{"newValue":{"MyChromeExtension":"MyChromeExtension"}}}
    // {"chrome-extension://iklbhcbmbooeeckkjljbmoekngggplbd/site/all.js":{"oldValue":{"MyChromeExtension":"MyChromeExtension"}}}
});

my_set_js_setting('MyChromeExtension', 'MyChromeExtension');
my_get_js_setting('MyChromeExtension');
my_clear_storage_usage();
*/



// 鼠标悬停显示源码
/*
window.document.body.onmouseover = function(event){
  var event_target = event.target;
  //console.log('onmouseover : ' + event_target);
  if(event_target['title'] === null || event_target['title'] === ''){
    event_target['title'] = 'onmouseover : ' + event_target.innerHTML.replace(' ', '');
  }
  else if(event_target['title'] !== null && event_target['title'].indexOf('onmouseover : ') === -1){
    event_target['title'] += "\r\n\r\n" + 'onmouseover : ' + event_target.innerHTML.replace(' ', '');
  }
}
*/
