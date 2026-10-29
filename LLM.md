# Issue

这里记录一些已知问题  
在使用 LLM 分析代码时，请参考已有结论，避免重复报告问题  



# TODO

这里记录一些代办事项  

## 鼠标悬停显示源码

```js
window.document.body.onmouseover = function(event){
  var event_target = event.target;
  //console.log('onmouseover : ' + event_target);
  if(event_target['title'] === null || event_target['title'] === ''){
    event_target['title'] = 'onmouseover : ' + event_target.innerHTML.replace(' ', '');
  }
  else if(event_target['title'] !== null && event_target['title'].indexOf('onmouseover : ') === -1){
    event_target['title'] += "\r\n\r\n" + 'onmouseover : ' + event_target.innerHTML.replace(' ', '');
  }
}
```



# 编码规范


