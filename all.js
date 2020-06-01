console.log('MyChromeExtension : all.js is loaded');

// 显示自动输入的密码
var passwords_logged = [];
var log_password = function () {
    var passwords = document.querySelectorAll('input[type="password"]');
    for (i = 0; i < passwords.length; i++) {
        var password = passwords[i].value;
        if(password !== '' && passwords_logged.indexOf(password) > -1){
            console.log("password : " + password);
            passwords_logged.push(password);
        }
    }
}();
setInterval(log_password, 3000);
