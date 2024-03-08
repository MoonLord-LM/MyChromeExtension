typeof (showLoadedFile) === 'function' && showLoadedFile();



// 提供 getEventListeners 等方法，修改页面元素的事件处理

/*
覆盖 JS 原生的 addEventListener 和 removeEventListener 方法
为每个元素添加属性：事件处理函数列表 eventListenerList、禁用的事件类型 disableEventTypeList
为每个元素添加方法：获取事件 getEventListeners、清空事件 clearEventListeners、禁用类型 disableEventListeners、启用类型 enableEventListeners

使用 document 的 disableEventListeners、enableEventListeners 方法，可以全局禁用、启用某一类的事件处理函数
*/