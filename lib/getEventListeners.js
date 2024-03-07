typeof (showLoadedFile) === 'function' && showLoadedFile();



// 提供 getEventListeners 等方法，修改页面元素的事件处理

/*
覆盖 JS 原生的 addEventListener 和 removeEventListener 方法
为每个元素添加属性：事件处理函数列表 eventListenerList、禁用的事件类型 disableEventTypeList
为每个元素添加方法：获取事件 getEventListeners、清空事件 clearEventListeners、禁用类型 disableEventListeners、启用类型 enableEventListeners

使用 document 的 disableEventListeners、enableEventListeners 方法，可以全局禁用、启用某一类的事件处理函数
*/



// default
EventTarget.prototype.originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.originalRemoveEventListener = EventTarget.prototype.removeEventListener;

// addEventListener
EventTarget.prototype.addEventListener = function (type, listener, useCapture = false) {
    if (this.disableEventTypeList && this.disableEventTypeList[type]) {
        console.log('addEventListener skiped, type has been disabled by target: ' + type);
        return;
    }
    if (document.disableEventTypeList && document.disableEventTypeList[type]) {
        console.log('addEventListener skiped, type has been disabled by document: ' + type);
        return;
    }

    this.originalAddEventListener(type, listener, useCapture);

    if (!this.eventListenerList) this.eventListenerList = {};
    if (!this.eventListenerList[type]) this.eventListenerList[type] = [];

    for (let i = 0; i < this.eventListenerList[type].length; i++) {
        if (this.eventListenerList[type][i].listener === listener && this.eventListenerList[type][i].useCapture === useCapture) {
            return;
        }
    }
    this.eventListenerList[type].push({ type, listener, useCapture });
};

// removeEventListener
EventTarget.prototype.removeEventListener = function (type, listener, useCapture = false) {
    this.originalRemoveEventListener(type, listener, useCapture);

    if (!this.eventListenerList) this.eventListenerList = {};
    if (!this.eventListenerList[type]) this.eventListenerList[type] = [];

    for (let i = 0; i < this.eventListenerList[type].length; i++) {
        if (this.eventListenerList[type][i].listener === listener && this.eventListenerList[type][i].useCapture === useCapture) {
            this.eventListenerList[type].splice(i, 1);
            break;
        }
    }
    if (this.eventListenerList[type].length == 0) delete this.eventListenerList[type];
};

// getEventListeners
EventTarget.prototype.getEventListeners = function (type) {
    if (!this.eventListenerList) this.eventListenerList = {};
    if (!this.eventListenerList[type]) this.eventListenerList[type] = [];

    return this.eventListenerList[type];
};

// clearEventListeners
EventTarget.prototype.clearEventListeners = function (type) {
    var listeners = this.getEventListeners(type);

    for (let i = 0; i < listeners.length; i++) {
        this.removeEventListener(type, listeners[i].listener, listeners[i].useCapture);
    }
};

// disableEventListeners
EventTarget.prototype.disableEventListeners = function (type) {
    if (!this.disableEventTypeList) this.disableEventTypeList = {};
    if (!this.disableEventTypeList[type]) this.disableEventTypeList[type] = true;

    this.clearEventListeners(type);
};

// enableEventListeners
EventTarget.prototype.enableEventListeners = function (type) {
    if (this.disableEventTypeList && this.disableEventTypeList[type]) delete this.disableEventTypeList[type];
};


