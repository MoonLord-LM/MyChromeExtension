// 显示当前加载的 JS 文件路径
var getCurrentFile = function () {
    var position = '<anonymous>';
    var error_stack = (new Error).stack.split("\n");
    if (error_stack.length > 1) {
        position = error_stack[error_stack.length - 1].trim();
        if (position.startsWith('at')) {
            position = position.substring(2).trim();
        }
        if (position.indexOf('(') !== -1) {
            position = position.substring(position.indexOf('(') + 1);
        }
        if (position.indexOf(':') !== -1) {
            position = position.substring(0, position.lastIndexOf(':'));
        }
        if (position.indexOf(':') !== -1) {
            position = position.substring(0, position.lastIndexOf(':'));
        }
        if (!position.endsWith('.js') && position !== '<anonymous>') {
            console.error('MyChromeExtension showLoadedFile error, position: ' + position);
        }
    }
    return position;
}
var showLoadedFile = function () {
    console.log('MyChromeExtension load js: ' + getCurrentFile());
};
showLoadedFile();



/*
提供 getEventListeners 等方法，修改页面元素的事件处理

覆盖 JS 原生的 addEventListener 和 removeEventListener 方法
为每个元素添加属性：事件处理函数列表 eventListenerList、禁用的事件类型 disableEventTypeList
为每个元素添加方法：获取事件 getEventListeners、清空事件 clearEventListeners、禁用类型 disableEventListeners、启用类型 enableEventListeners

使用 document 的 disableEventListeners、enableEventListeners 方法，可以全局禁用、启用某一类的事件处理函数
*/
function isNativeMethod(fn) {
    return typeof fn === 'function' && /\[native code\]/.test(Function.prototype.toString.call(fn));
}
var MyChromeExtensionAddEventListener = function (type, listener, useCapture = false) {
    if (this.disableEventTypeList && this.disableEventTypeList[type]) {
        console.log('MyChromeExtension addEventListener skiped, type has been disabled by target: ' + type);
        return;
    }
    if (document.disableEventTypeList && document.disableEventTypeList[type]) {
        console.log('MyChromeExtension addEventListener skiped, type has been disabled by document: ' + type);
        return;
    }

    if (isNativeMethod(this.originalAddEventListener)) {
        this.originalAddEventListener(type, listener, useCapture);
    }

    if (!this.eventListenerList) this.eventListenerList = {};
    if (!this.eventListenerList[type]) this.eventListenerList[type] = [];

    for (let i = 0; i < this.eventListenerList[type].length; i++) {
        if (this.eventListenerList[type][i].listener === listener && this.eventListenerList[type][i].useCapture === useCapture) {
            return;
        }
    }
    this.eventListenerList[type].push({ type, listener, useCapture });
};
var MyChromeExtensionRemoveEventListener = function (type, listener, useCapture = false) {
    if (isNativeMethod(this.originalRemoveEventListener)) {
        this.originalRemoveEventListener(type, listener, useCapture);
    }

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
if (isNativeMethod(EventTarget.prototype.addEventListener)) {
    EventTarget.prototype.originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = MyChromeExtensionAddEventListener;
}
if (isNativeMethod(EventTarget.prototype.removeEventListener)) {
    EventTarget.prototype.originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = MyChromeExtensionRemoveEventListener;
}
EventTarget.prototype.getEventListeners = function (type) {
    if (!this.eventListenerList) this.eventListenerList = {};
    if (!this.eventListenerList[type]) this.eventListenerList[type] = [];

    return this.eventListenerList[type];
};
EventTarget.prototype.clearEventListeners = function (type) {
    if (!this.eventListenerList) this.eventListenerList = {};
    if (!this.eventListenerList[type]) this.eventListenerList[type] = [];

    var listeners = this.eventListenerList[type];
    for (let i = 0; i < listeners.length; i++) {
        this.removeEventListener(type, listeners[i].listener, listeners[i].useCapture);
    }

    delete this.eventListenerList[type];
};
EventTarget.prototype.disableEventListeners = function (type) {
    if (!this.disableEventTypeList) this.disableEventTypeList = {};
    if (!this.disableEventTypeList[type]) this.disableEventTypeList[type] = true;

    this.clearEventListeners(type);
};
EventTarget.prototype.enableEventListeners = function (type) {
    if (this.disableEventTypeList && this.disableEventTypeList[type]) delete this.disableEventTypeList[type];
};


