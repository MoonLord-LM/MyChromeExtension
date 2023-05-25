typeof (showLoadedFile) === 'function' && showLoadedFile();



// 隐藏答题报告中的多余信息
// 仅保留原题，方便保存



if(window.location.href.startsWith('https://hr.nowcoder.com/console/paper/candidate/result')){
    document.querySelector('.test-report-right').style.display = 'none';
    document.querySelector('.test-report-left-tab').style.display = 'none';
    document.querySelectorAll('.question-header').forEach (function (object) {
        object.querySelector('.right').style.display = 'none';
    });
    document.querySelectorAll('.code-fragment-wrap').forEach (function (object) {
        object.style.display = 'none';
    });
    document.querySelectorAll('.answer-main').forEach (function (object) {
        object.style.display = 'none';
    });
    document.querySelectorAll('.examples-header .switch').forEach (function (object) {
        if(object.innerText === ' 展开'){
            object.click();
            object.style.display = 'none';
        }
        else if(object.innerText === ' 收起'){
            object.style.display = 'none';
        }
        else {
            console.log(object.innerText)
        }
    });
}


