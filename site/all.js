// 显示已加载的插件 JS 文件名
var my_get_loaded_js = function () {
    var error_stack = (new Error).stack.split("\n");
    var error_position = error_stack[error_stack.length - 1].trim();
    if (error_position.startsWith('at ')) {
        error_position = error_position.substr(3);
    }
    if (error_position.indexOf('(') !== -1) {
        error_position = error_position.substr(error_position.indexOf('(') + 1);
    }
    if (error_position.indexOf(':') !== -1) {
        error_position = error_position.substr(0, error_position.lastIndexOf(':'));
    }
    if (error_position.indexOf(':') !== -1) {
        error_position = error_position.substr(0, error_position.lastIndexOf(':'));
    }
    if (!error_position.startsWith('chrome-extension://') || !error_position.endsWith('.js')) {
        if(error_position !== '<anonymous>') {
            console.error('MyChromeExtension show_loaded_js failed, error_position: ' + error_position);
        }
    }
    return error_position;
};
var my_show_loaded_js = function () {
    console.log('MyChromeExtension load js: ' + my_get_loaded_js());
};
my_show_loaded_js();

// 显示已使用的 chrome.storage.sync 空间的字节数
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea
var my_show_storage_usage = function () {
    chrome.storage.sync.get(null, function(data) {
        console.log('MyChromeExtension sync storage: ' + JSON.stringify(data));
    });
    chrome.storage.sync.getBytesInUse(null, function(data) {
        console.log('MyChromeExtension sync storage usage: ' + data + ' Bytes');
    });
};
my_show_storage_usage();

var my_clear_storage_usage = function () {
    chrome.storage.sync.clear();
};
my_clear_storage_usage();

// 支持保存用户设置，对不同的 JS 隔离设置
var my_chrome_extension_js_settings = {};
var my_set_js_setting = function (key, value) {
    var js_setting = {};
    js_setting[key] = value;
    var js_file = my_get_loaded_js();
    var data = {};
    data[js_file] = js_setting;
    my_chrome_extension_js_settings[js_file] = js_setting;
    localStorage.setItem('my_chrome_extension_js_settings', JSON.stringify(my_chrome_extension_js_settings));
    chrome.storage.sync.set(data, function() {
        console.log('MyChromeExtension sync set ok: ' + JSON.stringify(data));
    });
    console.log('MyChromeExtension my_set_js_setting: ' + JSON.stringify(data));
};

var my_get_js_setting = function (key) {
    var js_file = my_get_loaded_js();
    chrome.storage.sync.get(null, function(data) {
        console.log('MyChromeExtension sync get ok: ' + JSON.stringify(data));
        my_chrome_extension_js_settings = data;
        localStorage.setItem('my_chrome_extension_js_settings', JSON.stringify(my_chrome_extension_js_settings));
    });
    var tmp_settings = JSON.parse(localStorage.getItem('my_chrome_extension_js_settings'));
    console.log('MyChromeExtension tmp_settings: ' + tmp_settings);
    console.log('MyChromeExtension tmp_settings: ' + js_file);
    console.log('MyChromeExtension tmp_settings: ' + tmp_settings[js_file]);
    console.log('MyChromeExtension tmp_settings: ' + key);
    console.log('MyChromeExtension tmp_settings: ' + tmp_settings[js_file][key]);
    var value = 'QAQ';
    if(tmp_settings && tmp_settings[js_file] && tmp_settings[js_file][key]){
        value = tmp_settings[js_file][key];
    }
    var data = {};
    data[key] = value;
    console.log('MyChromeExtension my_get_js_setting: ' + JSON.stringify(data));
    return value;
};

my_set_js_setting('MyChromeExtension', 'MyChromeExtension');
console.log('my_get_js_setting: ' + my_get_js_setting('MyChromeExtension'));

// Console 显示自动输入的密码
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
