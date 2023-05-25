typeof (showLoadedFile) === 'function' && showLoadedFile();



// 隐藏答题报告中的多余信息
// 仅保留原题，方便保存



if(window.location.href.startsWith('https://hr.nowcoder.com/console/paper/candidate/result')){
    // 避免保存网页时泄露信息
    history.pushState(null, null, window.location.href.split('?')[0]);
    setTimeout(function(){
        document.getElementsByTagName("title")[0].innerText = '牛客网考试编程题';
    }, 1000);
    // 删除多余元素
    document.querySelectorAll('.test-report-right , .test-report-left-tab').forEach (function (object) {
        object.parentNode.removeChild(object);
    });
    document.querySelectorAll('.question-header .right').forEach (function (object) {
        object.parentNode.removeChild(object);
    });
    document.querySelectorAll('.code-fragment-wrap').forEach (function (object) {
        object.parentNode.removeChild(object);
    });
    document.querySelectorAll('.answer-main').forEach (function (object) {
        object.parentNode.removeChild(object);
    });
    document.querySelectorAll('.examples-header .switch').forEach (function (object) {
        if(object.innerText === ' 展开'){
            object.click();
            object.parentNode.removeChild(object);
        }
        else if(object.innerText === ' 收起'){
            object.parentNode.removeChild(object);
        }
        else {
            console.log(object.innerText);
        }
    });
}


