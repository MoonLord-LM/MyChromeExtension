typeof (showLoadedFile) === 'function' && showLoadedFile();

// 登录失效后自动登录（需要先使用浏览器的记住密码）
var user_login = function () {
    var login_button = document.querySelector('form.login-form input[name="Submit"]');
    if(login_button !== null){
        var login_username = document.querySelector('form.login-form input[name="uid"]');
        var login_password = document.querySelector('form.login-form input[name="password"]');
        if(login_username !== null && login_password !== null){
            if(login_username.value !== '' && login_password.value !== ''){
                login_button.click();
            }
        }
    }
    //console.log('user_login is running ...');
}
user_login();
setInterval(user_login, 15000);
