typeof(showLoadedFile) === 'function' && showLoadedFile();



// 在 Console 显示自动输入的密码（需要点一下页面）

var passwords_showed = [];
var showPassword = function () {
    var passwords = document.querySelectorAll('input[type="password"]');
    for (let i = 0; i < passwords.length; i++) {
        var password = passwords[i].value;
        if (password !== '' && passwords_showed.indexOf(password) === -1) {
            console.log('MyChromeExtension show password: ' + password);
            passwords_showed.push(password);
        }
    }
};
setInterval(showPassword, 2000);


