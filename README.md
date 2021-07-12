# MyChromeExtension
MyChromeExtension  

# 笔记
在插件的 content_scripts 的代码中获取到的 window 对象，是 Content Scripts 里的，不是页面里的  
如果需要在代码中修改页面的 window 对象，可以通过操作 Dom 插入 JS 代码，间接实现  
