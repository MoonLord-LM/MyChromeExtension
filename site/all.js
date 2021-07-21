// 显示已加载的插件 JS 文件名
{
    var new_error_stack = (new Error).stack.split("\n");
    if(new_error_stack.length >= 2) {
        var stack0 = new_error_stack[0];
        var stack1 = new_error_stack[1];
        if(stack0 === "Error") {
            var file_name_line = stack1.trim();
            if(file_name_line.startsWith("at ")) {
                file_name_line = file_name_line.substr(3);
                if(file_name_line.indexOf(":") !== -1) {
                    file_name_line = file_name_line.substr(0, file_name_line.lastIndexOf(":"));
                    if(file_name_line.indexOf(":") !== -1) {
                        var js_file_name = file_name_line.substr(0, file_name_line.lastIndexOf(":"));
                        console.log('MyChromeExtension load js: ' + js_file_name);
                    }
                }
            }
        }
    }
};

// Console 显示自动输入的密码
var passwords_logged = [];
var log_password = function () {
    var passwords = document.querySelectorAll('input[type="password"]');
    for (i = 0; i < passwords.length; i++) {
        var password = passwords[i].value;
        if(password !== '' && passwords_logged.indexOf(password) == -1){
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
