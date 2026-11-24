// 使用豆包网页版，作为 LLM 后端
// 定时从 local.php 的接口拉取请求，让豆包生成 JSON 响应，再上报回去



var proxyBaseUrl = 'https://www.moonlord.cc/service/llm-proxy/local.php';
var intervalSeconds = 2;
var isBusy = false;

var promptInstruction1 = '现在你是一个 LLM 的 Chat Completions API 服务，使用 OpenAI API 协议，并且支持 tools 工具调用。';
var promptInstruction2 = '请处理以下的 JSON 请求，并按照 OpenAI API 协议，回复 JSON 响应。';
var promptInstruction = promptInstruction1 + '\n'+ promptInstruction2 + '\n\n';

// 对话输入框
var findComposer = function () {
    return document.querySelector('[data-testid="chat_input_input"] [contenteditable="true"]');
};

// 新对话按钮
var findNewChatButton = function () {
    return document.querySelector('[data-testid="create_conversation_button"]');
};

// 开启新对话，等待输入框就绪且旧回复清空
var startNewChat = async function () {
    var button = findNewChatButton();
    if (!button) {
        return;
    }
    button.click();
    while (true) {
        var composer = findComposer();
        var responseCount = document.querySelectorAll('[data-testid="receive_message"]').length;
        if (composer && responseCount === 0) {
            return;
        }
        var reason = !composer ? '输入框未出现' : '旧回复未清空';
        console.log('doubao.com 等待新对话：' + reason);
        await new Promise(function (resolve) {
            setTimeout(resolve, 1000);
        });
    }
};

// 查找可用的发送按钮
var findSendButton = function () {
    var button = document.querySelector('button[data-testid="chat_input_send_button"]');
    if (button && button.getAttribute('aria-disabled') !== 'true' && button.getAttribute('data-loading') !== 'true') {
        return button;
    }
    return null;
};

// 是否仍在生成回复
var isGenerating = function () {
    var breakButton = document.querySelector('[data-testid="chat_input_local_break_button"]');
    return !!breakButton && breakButton.className.indexOf('!hidden') === -1 && breakButton.offsetParent !== null;
};

// 最后一条助手回复文本
var getLastAssistantResponse = function () {
    var responses = document.querySelectorAll('[data-testid="receive_message"] [data-testid="message_text_content"]');
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
var waitForResponse = async function (previousText) {
    while (true) {
        var currentText = getLastAssistantResponse() || '';
        if (currentText && currentText !== previousText && !isGenerating()) {
            return currentText;
        }
        var reason = !currentText ? '暂无回复' : (currentText === previousText ? '回复未变化' : '仍在生成');
        console.log('doubao.com 等待回复：' + reason);
        await new Promise(function (resolve) {
            setTimeout(resolve, 1000);
        });
    }
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

        var prompt = promptInstruction + JSON.stringify(pending.request || {}, null, 2);

        await startNewChat();
        var previousText = getLastAssistantResponse() || '';
        var inputOk = await inputPromptText(prompt);
        var sendButton = findSendButton();
        if (!inputOk || !sendButton) {
            console.log('doubao.com 输入或发送按钮未就绪，跳过本轮');
            return;
        }
        sendButton.click();

        var text = await waitForResponse(previousText);
        console.log('doubao.com 输出: ' + text);

        var responseBody;
        try {
            responseBody = JSON.parse(text.trim());
        } catch (error) {
            console.log('doubao.com 回复不是合法 JSON', error);
            return;
        }
        if (!responseBody || typeof responseBody !== 'object' || Array.isArray(responseBody)) {
            console.log('doubao.com 回复不是 JSON 对象，跳过本轮');
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
        console.log('doubao.com 响应已提交');
    } catch (error) {
        console.log('doubao.com 处理失败', error);
    } finally {
        isBusy = false;
    }
};

// 启动定时轮询
setInterval(runOnce, intervalSeconds * 1000);
