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

// 插件设置同步
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea
var my_show_storage_usage = function () {
    chrome.storage.sync.get(null, function(data) {
        console.log('MyChromeExtension sync storage: ' + JSON.stringify(data));
    });
    chrome.storage.sync.getBytesInUse(null, function(data) {
        console.log('MyChromeExtension sync storage usage: ' + data + ' Bytes');
    });
    chrome.storage.local.get(null, function(data) {
        console.log('MyChromeExtension storage: ' + JSON.stringify(data));
    });
    chrome.storage.local.getBytesInUse(null, function(data) {
        console.log('MyChromeExtension storage usage: ' + data + ' Bytes');
    });
};
my_show_storage_usage();

var my_set_js_setting = function (key, value) {
    var data = {};
    data[key] = value;
    console.log('MyChromeExtension my_set_js_setting: ' + JSON.stringify(data));
    chrome.storage.sync.set(data, function() { });
    chrome.storage.local.set(data, function() { });
};
my_set_js_setting('MyChromeExtension','MyChromeExtension');

var my_get_js_setting = function (key) {
    console.log('MyChromeExtension my_get_js_setting: ' + key);
    chrome.storage.local.get(key, function(data) {
        console.log(JSON.stringify(data));
        return data;
    });
};
my_set_js_setting('MyChromeExtension','MyChromeExtension');
console.log('my_get_js_setting: ' + my_get_js_setting('MyChromeExtension'));

chrome.storage.sync.clear();
var my_chrome_extension_setting1 = {'foo1':'bar1','foo2':'bar2'};
var my_chrome_extension_setting2 = {'foo3':'bar3','foo4':'bar4'};
chrome.storage.sync.set(my_chrome_extension_setting1, function() { console.log(my_chrome_extension_setting1); } );
chrome.storage.sync.set(my_chrome_extension_setting2, function() { console.log(my_chrome_extension_setting2); } );
chrome.storage.sync.get('foo1', function(data) { console.log(JSON.stringify(data)); } );
chrome.storage.sync.get('foo2', function(data) { console.log(JSON.stringify(data)); } );

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
