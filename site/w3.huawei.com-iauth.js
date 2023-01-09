typeof (showLoadedFile) === 'function' && showLoadedFile();

if(window.location.href.startsWith('http://w3.huawei.com/next/indexa.html') || window.location.href.startsWith('https://w3.huawei.com/next/indexa.html')){
    // 自动点击 iAuth 的待办
    var click_iauth_task_url = function () {
        var iauth_task_title = document.querySelector('div.panelDivTodo div.slidepanel_lib_unselected div.title span[title="iAuth"]');
        if(iauth_task_title !== null && iauth_task_title.innerText === 'iAuth'){
            iauth_task_title.parentNode.click();
            setTimeout(function () {
                window.location.reload();
            }, 5000);
            console.log('click_iauth_task_url iauth_task_title click');
            return;
        }
        var iauth_task_urls = document.querySelectorAll('div[id="tasks_iAuth"] ul li table tbody tr td a');
        var iauth_task_count = 0;
        for (let i = 0; i < iauth_task_urls.length; i++) {
            task_url = iauth_task_urls[i].href;
            if(task_url.startsWith('http://w3.huawei.com/iauth/#/applyRouter') || task_url.startsWith('https://w3.huawei.com/iauth/#/applyRouter')){
                iauth_task_count += 1;
                console.log("iauth_task_count " + iauth_task_count + " : " + task_url);
                window.open(task_url);
            }
        }
        if(iauth_task_count > 0){
            setTimeout(function () {
                window.location.reload();
            }, 15000);
            console.log('click_iauth_task_url iauth_task_count: ' + iauth_task_count);
            return;
        }
        setTimeout(function () {
            window.location.reload();
        }, 60000);
        //console.log('click_iauth_task_url is running ...');
    };
    setTimeout(click_iauth_task_url, 5000);
}

if(window.location.href.startsWith('http://w3.huawei.com/iauth/#/applyRouter') || window.location.href.startsWith('https://w3.huawei.com/iauth/#/applyRouter')){
    // 自动审批 iAuth 的申请
    var auto_approve = function () {
        // 先移除问题反馈的弹窗表单，防止误提交
        var question_box = document.querySelector('div.questionBox');
        if(question_box != null){
            question_box.parentNode.removeChild(question_box);
            console.log('auto_approve question_box removed');
        }
        // 输入审批意见、抄送人、勾选承诺、提交
        var comment_count = 0;
        var copy_count = 0;
        var check_count = 0;
        var edit_area = document.querySelector('div.approvalcomments div.idm-area');
        if(edit_area != null){
            // 审批意见
            var form_items = edit_area.querySelectorAll('div.hae-form-item');
            for (let i = 0; i < form_items.length; i++) {
                var item_label = form_items[i].querySelector('label.form-item-label');
                if(item_label != null && item_label.innerText.endsWith('审批意见')){
                    var approval_comment = form_items[i].querySelector('div.form-item-content div.hae-input textarea.textarea');
                    if(approval_comment != null){
                        if(approval_comment.value == ''){
                            approval_comment.value = '审批 OK';
                        }
                        comment_count += 1;
                    }
                    approval_comment.dispatchEvent(new Event('input'));
                    approval_comment.dispatchEvent(new Event('change'));
                }
            }
            if(comment_count > 0){
                console.log('auto_approve comment_count: ' + comment_count);
            }
            // 勾选承诺
            var checkboxes = edit_area.querySelectorAll('div.checkValue div div[widget="Selectgroup"] ul li span.hae-checkbox span');
            for (let i = 0; i < checkboxes.length; i++) {
                if(checkboxes[i].className.indexOf('checked') == -1){
                    checkboxes[i].click();
                }
                check_count += 1;
            }
            if(check_count > 0){
                console.log('auto_approve check_count: ' + check_count);
            }
        }
        // 提交
        if(comment_count == 0 || check_count == 0){
            console.log('auto_approve edit failed, should not click');
            return;
        }
        if(copy_count > 0){
            alert("TODO 测试中断");
        }
        var primary_buttons = document.querySelectorAll('div.idm-footerBtn div.footerBtn_smallBox div.btnBox div.footerBtn_css button[hue="primary"]');
        for (let i = 0; i < primary_buttons.length; i++) {
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
