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
            setTimeout(function () {
                window.location.reload();
            }, 20000);
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
        var check_count = 0;
        var edit_area = document.querySelector('div.approvalcomments div.idm-area');
        if(edit_area != null){
            var items = edit_area.querySelectorAll('div.hae-form-item');
            for (i = 0; i < items.length; i++) {
                var item_label = items[i].querySelector('label.form-item-label');
                if(item_label != null && item_label.innerText.endsWith('审批意见')){
                    var approval_comment = items[i].querySelector('div.form-item-content div.hae-input textarea');
                    if(approval_comment != null){
                        if(approval_comment.value == ''){
                            approval_comment.value = '审批 OK';
                        }
                        comment_count += 1;
                    }
                }
            }
            if(comment_count > 0){
                console.log('auto_approve comment_count: ' + comment_count);
            }
            var checkboxes = edit_area.querySelectorAll('div.checkValue div div[widget="Selectgroup"] ul li span.hae-checkbox span');
            for (i = 0; i < checkboxes.length; i++) {
                if(checkboxes[i].className.indexOf('checked') == -1){
                    checkboxes[i].click();
                }
                check_count += 1;
            }
            if(check_count > 0){
                console.log('auto_approve check_count: ' + check_count);
            }
        }
        if(comment_count == 0 || check_count == 0){
            console.log('auto_approve edit failed, should not click');
            return;
        }
        var primary_buttons = document.querySelectorAll('div.idm-footerBtn div.footerBtn_smallBox div.btnBox div.footerBtn_css button[hue="primary"]');
        for (i = 0; i < primary_buttons.length; i++) {
            if(primary_buttons[i].innerText == '提交' || primary_buttons[i].innerText == '同意'){
                console.log('auto_approve click: ' + primary_buttons[i].innerText);
                primary_buttons[i].click();
                break;
            }
        }
        //console.log('auto_approve is running ...');
    };
    auto_approve();
    setInterval(auto_approve, 3000);
}
