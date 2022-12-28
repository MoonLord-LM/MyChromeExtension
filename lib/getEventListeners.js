console.log('MyChromeExtension : getEventListeners.js is loaded');



(function () {
    'use strict';

    EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype._removeEventListener = EventTarget.prototype.removeEventListener;

    EventTarget.prototype.addEventListener = function (type, listener, useCapture = false) {
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

    EventTarget.prototype.getEventListeners = function (type) {
        if (!this.eventListenerList) this.eventListenerList = {};
        if (!this.eventListenerList[type]) this.eventListenerList[type] = [];

        return this.eventListenerList[type];
    };

    EventTarget.prototype.clearEventListeners = function (type) {
        var listeners = this.getEventListeners(type);

        for (let i = 0; i < listeners.length; i++) {
            this.removeEventListener(type, listeners[i].listener, listeners[i].useCapture);
        }
    };

})();


