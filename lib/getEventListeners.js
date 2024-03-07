typeof (showLoadedFile) === 'function' && showLoadedFile();



// 覆盖页面原生的 addEventListener、removeEventListener
// 为每个元素，记录事件处理函数列表 eventListenerList 和禁用的事件类型列表 disableEventTypeList
// 为每个元素，新增 getEventListeners、clearEventListeners、disableEventListeners、enableEventListeners 方法，用于获取、删除、禁用、启用指定的事件处理函数
// 使用 document 的 disableEventListeners、enableEventListeners 方法，可以全局禁用、启用某一类的事件处理函数
EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype._removeEventListener = EventTarget.prototype.removeEventListener;

// replace addEventListener
EventTarget.prototype.addEventListener = function (type, listener, useCapture = false) {
    if (this.disableEventTypeList && this.disableEventTypeList[type]) {
        console.log('addEventListener skiped, type has been disabled by target: ' + type);
        return;
    }
    if (document.disableEventTypeList && document.disableEventTypeList[type]) {
        console.log('addEventListener skiped, type has been disabled by document: ' + type);
        return;
    }

    this._addEventListener(type, listener, useCapture);

    if (!this.eventListenerList) this.eventListenerList = {};
    if (!this.eventListenerList[type]) this.eventListenerList[type] = [];

    for (let i = 0; i < this.eventListenerList[type].length; i++) {
        if (this.eventListenerList[type][i].listener === listener && this.eventListenerList[type][i].useCapture === useCapture) {
            return;
        }
    }
    this.eventListenerList[type].push({ type, listener, useCapture });
};

// replace removeEventListener
EventTarget.prototype.removeEventListener = function (type, listener, useCapture = false) {
    this._removeEventListener(type, listener, useCapture);

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

// add getEventListeners
EventTarget.prototype.getEventListeners = function (type) {
    if (!this.eventListenerList) this.eventListenerList = {};
    if (!this.eventListenerList[type]) this.eventListenerList[type] = [];

    return this.eventListenerList[type];
};

// add clearEventListeners
EventTarget.prototype.clearEventListeners = function (type) {
    var listeners = this.getEventListeners(type);

    for (let i = 0; i < listeners.length; i++) {
        this.removeEventListener(type, listeners[i].listener, listeners[i].useCapture);
    }
};

// add disableEventListeners
EventTarget.prototype.disableEventListeners = function (type) {
    if (!this.disableEventTypeList) this.disableEventTypeList = {};
    if (!this.disableEventTypeList[type]) this.disableEventTypeList[type] = true;

    this.clearEventListeners(type);
};

// add enableEventListeners
EventTarget.prototype.enableEventListeners = function (type) {
    if (this.disableEventTypeList && this.disableEventTypeList[type]) delete this.disableEventTypeList[type];
};


