typeof (showLoadedFile) === 'function' && showLoadedFile();

// www.doubao.com/chat 作为 WebModel 后端：从 llm-proxy 取请求，让豆包生成 JSON 响应，再写回队列。
// 响应同时打印到 Console、保存到 chrome.storage.local.doubaoLastResponse，并派发到页面。

var proxyBaseUrl = 'https://www.moonlord.cc/service/llm-proxy/local.php';
var intervalSeconds = 2;
var isBusy = false;

// 输入框（Tiptap / ProseMirror）
var findComposer = function () {
    return document.querySelector('[data-testid="chat_input_input"] [contenteditable="true"], div.tiptap.ProseMirror[contenteditable="true"], [role="textbox"][contenteditable="true"]');
};

// 侧边栏「新对话」按钮
var findNewChatButton = function () {
    return document.querySelector('[data-testid="create_conversation_button"] [role="button"], [data-testid="create_conversation_button"]');
};

// 开启新对话，等待输入框就绪且旧回复清空
var startNewChat = function () {
    return new Promise(function (resolve) {
        var button = findNewChatButton();
        if (!button) {
            resolve();
            return;
        }
        button.click();
        var attempts = 0;
        var checkReady = function () {
            var composer = findComposer();
            var responseCount = document.querySelectorAll('[data-testid="receive_message"]').length;
            if ((composer && responseCount === 0) || ++attempts >= 30) {
                resolve();
                return;
            }
            setTimeout(checkReady, 300);
        };
        setTimeout(checkReady, 500);
    });
};

// 查找可用的发送按钮
var findSendButton = function () {
    var selectors = [
        'button[data-testid="chat_input_send_button"]',
        'button#flow-end-msg-send',
        'button[data-testid*="send"]'
    ];
    for (var i = 0; i < selectors.length; i++) {
        var button = document.querySelector(selectors[i]);
        if (button && button.getAttribute('aria-disabled') !== 'true' && button.getAttribute('data-loading') !== 'true') {
            return button;
        }
    }
    return null;
};

// 是否仍在生成回复
var isGenerating = function () {
    var breakButton = document.querySelector('[data-testid="chat_input_local_break_button"]');
    if (breakButton && breakButton.className.indexOf('!hidden') === -1 && breakButton.offsetParent !== null) {
        return true;
    }
    return !!document.querySelector('[data-testid="message_text_content"][data-streaming="true"], [data-testid="message_loading"], button[data-testid*="break"]');
};

// 最后一条助手回复文本
var getLastAssistantResponse = function () {
    var selector = '[data-testid="receive_message"] [data-testid="message_text_content"], [class*="bg-g-receive-msg-bubble"] [data-testid="message_text_content"]';
    var responses = document.querySelectorAll(selector);
    if (responses.length === 0) {
        responses = document.querySelectorAll('[data-testid="receive_message"]');
    }
    if (responses.length === 0) {
        return null;
    }
    var last = responses[responses.length - 1];
    var message = last.closest('[data-testid="receive_message"]') || last;
    var codeElement = message.querySelector('pre code');
    return codeElement ? codeElement.textContent.trim() : (last.innerText || last.textContent || '').trim();
};

// 把文本写入输入框并读回校验
var inputPromptText = function (text) {
    return new Promise(function (resolve) {
        var composer = findComposer();
        if (!composer) {
            resolve(false);
            return;
        }
        composer.focus();
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(composer);
        selection.removeAllRanges();
        selection.addRange(range);
        if (!document.execCommand('insertText', false, text)) {
            var clipboardData = new DataTransfer();
            clipboardData.setData('text/plain', text);
            composer.dispatchEvent(new ClipboardEvent('paste', {
                bubbles: true,
                cancelable: true,
                clipboardData: clipboardData
            }));
        }
        setTimeout(function () {
            var currentText = (composer.innerText || composer.textContent || '').trim();
            resolve(currentText.indexOf(text.trim().slice(0, 20)) !== -1);
        }, 100);
    });
};

// 等待新回复生成完成
var waitForResponse = function (previousText) {
    return new Promise(function (resolve) {
        var attempts = 0;
        var poll = function () {
            var currentText = getLastAssistantResponse() || '';
            if (currentText && currentText !== previousText && !isGenerating()) {
                resolve(currentText);
                return;
            }
            if (++attempts >= 40) {
                resolve(null);
                return;
            }
            setTimeout(poll, 1000);
        };
        setTimeout(poll, 1000);
    });
};

// 取一个请求，交给豆包处理，再把响应写回队列
var runOnce = async function () {
    if (isBusy || isGenerating()) {
        return;
    }
    isBusy = true;
    try {
        var httpResponse = await fetch(proxyBaseUrl + '/v1/request/get');
        if (httpResponse.status === 404) {
            return;
        }
        if (!httpResponse.ok) {
            throw new Error('HTTP ' + httpResponse.status);
        }
        var pending = await httpResponse.json();

        var prompt = '你是一个 LLM 的 Chat Completions API 服务，使用 OpenAI API 协议，并且支持 tools 工具调用。处理以下的 JSON 请求。回复符合 OpenAI API 协议的 JSON 响应。\n'
            + JSON.stringify(pending.request || {}, null, 2);

        await startNewChat();
        var previousText = getLastAssistantResponse() || '';
        var inputOk = await inputPromptText(prompt);
        var sendButton = findSendButton();
        if (!inputOk || !sendButton) {
            console.log('MyChromeExtension doubao.com: 输入或发送按钮未就绪，跳过本轮');
            return;
        }
        sendButton.click();

        var text = await waitForResponse(previousText);
        if (!text) {
            console.log('MyChromeExtension doubao.com: 等待回复超时');
            return;
        }
        console.log('MyChromeExtension doubao.com 输出: ' + text);

        var responseBody;
        try {
            responseBody = JSON.parse(text.trim());
        } catch (error) {
            console.log('MyChromeExtension doubao.com: 回复不是合法 JSON', error);
            return;
        }
        if (!responseBody || typeof responseBody !== 'object' || Array.isArray(responseBody)) {
            console.log('MyChromeExtension doubao.com: 回复不是 JSON 对象，跳过本轮');
            return;
        }

        var responseData = {
            hash: pending.hash,
            prompt: prompt,
            text: text,
            time: Date.now()
        };
        chrome.storage.local.set({ doubaoLastResponse: responseData });
        document.dispatchEvent(new CustomEvent('MyChromeExtensionDoubaoResponse', { detail: responseData }));

        var handleResponse = await fetch(proxyBaseUrl + '/v1/request/handle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hash: pending.hash, response: responseBody })
        });
        if (!handleResponse.ok) {
            throw new Error('HTTP ' + handleResponse.status);
        }
        console.log('MyChromeExtension doubao.com: 响应已提交');
    } catch (error) {
        console.log('MyChromeExtension doubao.com: 处理失败', error);
    } finally {
        isBusy = false;
    }
};

// 启动定时轮询
var scheduleNext = function () {
    setTimeout(function () {
        runOnce();
        scheduleNext();
    }, intervalSeconds * 1000);
};
setTimeout(function () {
    runOnce();
    scheduleNext();
}, 1000);
