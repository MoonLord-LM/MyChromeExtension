// 显示已加载的插件 JS 文件名
my_show_loaded_js = function () {
    var error_stack = (new Error).stack.split("\n");
    var error_position = error_stack[error_stack.length - 1].trim();
    if (error_position.startsWith("at ")) {
        error_position = error_position.substr(3);
    }
    if (error_position.indexOf("(") !== -1) {
        error_position = error_position.substr(error_position.indexOf("(") + 1);
    }
    if (error_position.indexOf(":") !== -1) {
        error_position = error_position.substr(0, error_position.lastIndexOf(":"));
    }
    if (error_position.indexOf(":") !== -1) {
        error_position = error_position.substr(0, error_position.lastIndexOf(":"));
    }
    if (!error_position.startsWith("chrome-extension://") || !error_position.endsWith(".js")) {
        if(error_position !== "<anonymous>") {
            console.error("MyChromeExtension show_loaded_js failed, error_position: " + error_position);
        }
    }
    console.log('MyChromeExtension load js: ' + error_position);
};
my_show_loaded_js();

// Console 显示自动输入的密码
var passwords_logged = [];
var log_password = function () {
    var passwords = document.querySelectorAll('input[type="password"]');
    for (i = 0; i < passwords.length; i++) {
        var password = passwords[i].value;
        if(password !== '' && passwords_logged.indexOf(password) === -1){
            console.log("password : " + password);
            passwords_logged.push(password);
        }
    }
    //console.log('log_password is running ...');
};
log_password();
setInterval(log_password, 3000);

chrome.storage.sync.set({"foo":"bar"}, function() { console.log("set foo: bar"); } );
chrome.storage.sync.get("foo", function(data) { console.log("get foo: " + JSON.stringify(data)); } );

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
