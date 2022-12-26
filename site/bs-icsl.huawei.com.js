typeof(my_show_loaded_js) === 'function' && my_show_loaded_js();

// 登录失效后尝试自动登录
var user_relogin = function () {
    var relogin_button = document.querySelector('div.time-panel div.time-panel-body a#reLogin');
    if(relogin_button !== null && relogin_button.text === '重新登录'){
        relogin_button.click();
    }
    //console.log('user_relogin is running ...');
}
user_relogin();
setInterval(user_relogin, 3000);
