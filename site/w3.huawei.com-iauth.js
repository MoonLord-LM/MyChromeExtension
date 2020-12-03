console.log('MyChromeExtension : w3.huawei.com-iauth.js is loaded');

if(window.location.href.startsWith('http://w3.huawei.com/next/') || window.location.href.startsWith('https://w3.huawei.com/next/')){
    // 自动点击 iAuth 的待办
    var click_iauth_task_url = function () {
        var task_urls = document.querySelectorAll('div[id="tasks_iAuth"] ul li table tbody tr td a');
        var iauth_task_count = 0;
        for (i = 0; i < task_urls.length; i++) {
            task_url = task_urls[i].href;
            if(task_url.startsWith('http://w3.huawei.com/iauth/') || task_url.startsWith('https://w3.huawei.com/iauth/')){
                iauth_task_count += 1;
                console.log("iauth_task_count " + iauth_task_count + " : " + task_url);
                window.open(task_url);
            }
        }
        if(iauth_task_count > 0){
            window.location.reload();
        }
        //console.log('click_iauth_task_url is running ...');
    };
    click_iauth_task_url();
    setInterval(click_iauth_task_url, 30000);
}

if(window.location.href.startsWith('http://w3.huawei.com/iauth/#/applyRouter') || window.location.href.startsWith('https://w3.huawei.com/iauth/#/applyRouter')){
    // 自动审批 iAuth 的申请
    var auto_approve = function () {
        var comment_count = 0;
        var approval_comments = document.querySelectorAll('div.approvalcomments div.idm-area div div div textarea');
        for (i = 0; i < approval_comments.length; i++) {
            if(approval_comments[i].value == ''){
                approval_comments[i].value = 'OK';
            }
            comment_count += 1;
        }
        if(comment_count > 0){
            console.log('auto_approve comment_count: ' + comment_count);
        }
        var check_count = 0;
        var checkboxes = document.querySelectorAll('div.approvalcomments div.idm-area div div div ul li span.hae-checkbox span');
        for (i = 0; i < checkboxes.length; i++) {
            if(checkboxes[i].className.indexOf('checked') == -1){
                checkboxes[i].click();
            }
            check_count += 1;
        }
        if(check_count > 0){
            console.log('auto_approve check_count: ' + check_count);
        }
        if(comment_count > 0 && check_count > 0){
            var primary_buttons = document.querySelectorAll('div.footerBtn_css button[hue="primary"]');
            for (i = 0; i < primary_buttons.length; i++) {
                if(primary_buttons[i].innerText == '提交' || primary_buttons[i].innerText == '同意'){
                    primary_buttons[i].click();
                    console.log('auto_approve click: ' + primary_buttons[i].innerText + ' ' + primary_buttons[i].innerHTML);
                    break;
                }
            }
        }
        //console.log('auto_approve is running ...');
    };
    auto_approve();
    setInterval(auto_approve, 3000);
}
