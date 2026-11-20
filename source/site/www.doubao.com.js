typeof (showLoadedFile) === 'function' && showLoadedFile();



// www.doubao.com/chat 作为 WebModel 后端
// 从 llm-proxy 取请求 -> 让豆包扮演 API 端点生成响应 -> 写回队列
// 回复同时：打印到 Console、保存到 chrome.storage.local.doubaoLastResponse、
// 以 MyChromeExtensionDoubaoResponse 事件派发到页面上

// llm-proxy 接口基路径
var proxyBaseUrl = 'https://www.moonlord.cc/service/llm-proxy/local.php';

// 固定轮询间隔（秒）
var intervalSeconds = 2;

// 运行时状态
var isBusy = false;
var busySince = 0;
var busyTimeoutMs = 45000;
var runGeneration = 0;

// 查找豆包的输入框（Tiptap / ProseMirror）
var findComposer = function () {
    return document.querySelector('[data-testid="chat_input_input"] [contenteditable="true"]')
        || document.querySelector('div.tiptap.ProseMirror[contenteditable="true"]')
        || document.querySelector('[contenteditable="true"][data-testid="chat_input_input"]')
        || document.querySelector('div[role="textbox"][contenteditable="true"]');
};

// 查找侧边栏的「新对话」按钮
var findNewChatButton = function () {
    var button = document.querySelector('[data-testid="create_conversation_button"] [role="button"]')
        || document.querySelector('[data-testid="create_conversation_button"]');
    if (button) {
        return button;
    }
    var buttons = document.querySelectorAll('button, a, [role="button"]');
    for (var i = 0; i < buttons.length; i++) {
        var label = (buttons[i].textContent || '').trim();
        if (label === '新对话' || label === '开启新对话' || label === 'New chat' || label === 'New Chat') {
            return buttons[i];
        }
    }
    return null;
};

// 开启新对话，等输入框就绪且旧回复清空后回调
var startNewChat = function (generation, callback) {
    var newChatButton = findNewChatButton();
    if (!newChatButton) {
        console.log('MyChromeExtension doubao.com: 未找到新对话按钮，继续使用当前会话');
        callback(findComposer());
        return;
    }
    newChatButton.click();
    var attempts = 0;
    var checkReady = function () {
        if (generation !== runGeneration) {
            return;
        }
        attempts++;
        var composer = findComposer();
        var responseCount = document.querySelectorAll('[data-testid="receive_message"], [data-message-role="assistant"]').length;
        if (composer && responseCount === 0) {
            callback(composer);
            return;
        }
        if (attempts >= 30) {
            console.log('MyChromeExtension doubao.com: 等待新对话就绪超时');
            callback(findComposer());
            return;
        }
        setTimeout(checkReady, 300);
    };
    setTimeout(checkReady, 500);
};

// 查找当前可用的发送按钮
var findSendButton = function () {
    var selectors = [
        'button[data-testid="chat_input_send_button"]',
        'button#flow-end-msg-send',
        'button[data-testid*="send"]',
        'button[aria-label*="发送"]'
    ];
    for (var i = 0; i < selectors.length; i++) {
        var button = document.querySelector(selectors[i]);
        if (button && button.getAttribute('aria-disabled') !== 'true'
            && button.getAttribute('data-disabled') !== 'true'
            && button.getAttribute('data-loading') !== 'true') {
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
    if (document.querySelector('[data-testid="message_text_content"][data-streaming="true"]')
        || document.querySelector('[data-testid="message_loading"], [data-testid="conversation-list-v2-status-loading"]')) {
        return true;
    }
    return !!document.querySelector('button[data-testid*="break"], button[aria-label*="停止生成"], button[aria-label*="Stop generating"]');
};

// 获取最后一条助手回复
var getLastAssistantResponse = function () {
    var responses = document.querySelectorAll('[data-testid="receive_message"] [data-testid="message_text_content"], [class*="bg-g-receive-msg-bubble"] [data-testid="message_text_content"]');
    if (responses.length === 0) {
        responses = document.querySelectorAll('[data-testid="receive_message"], [data-message-role="assistant"]');
    }
    if (responses.length === 0) {
        console.log('MyChromeExtension doubao.com: 未找到助手回复元素');
        return null;
    }
    var last = responses[responses.length - 1];
    var message = last.closest('[data-testid="receive_message"]') || last;
    var messageContent = message.querySelector('[data-testid="message_content"]') || message;
    var codeElement = message.querySelector('pre code') || last.querySelector('pre code');
    return {
        id: messageContent.getAttribute('data-message-id') || '',
        text: codeElement ? codeElement.textContent.trim() : (last.innerText || last.textContent || '').trim()
    };
};

// 向 contenteditable 写入文本，通过 paste 事件让 ProseMirror 自行插入，兼容 ProseMirror
// 写入后读回校验；失败则等待编辑器就绪后重新查找输入框并重试
var inputPromptText = function (text, generation, callback) {
    var attempts = 0;
    var maxAttempts = 10;
    var expectedPrefix = text.trim().slice(0, 20);
    console.log('MyChromeExtension doubao.com: 开始填入文本，长度 ' + text.length + '，校验前缀 "' + expectedPrefix + '"');
    var tryInput = function () {
        if (generation !== runGeneration) {
            console.log('MyChromeExtension doubao.com: 文本填入已取消（任务代次变化）');
            return;
        }
        var composer = findComposer();
        if (!composer || !composer.isConnected) {
            attempts++;
            console.log('MyChromeExtension doubao.com: 输入框不可用，第 ' + attempts + '/' + maxAttempts + ' 次重试');
            if (attempts >= maxAttempts) {
                console.log('MyChromeExtension doubao.com: 文本填入失败，已放弃（输入框始终不可用）');
                callback(false);
                return;
            }
            setTimeout(tryInput, 300);
            return;
        }
        composer.focus();
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(composer);
        selection.removeAllRanges();
        selection.addRange(range);
        var inserted = document.execCommand('insertText', false, text);
        console.log('MyChromeExtension doubao.com: execCommand insertText 返回 ' + inserted + '，当前长度 ' + (composer.innerText || composer.textContent || '').trim().length);
        if (!inserted) {
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
            if (currentText.length > 0 && currentText.indexOf(expectedPrefix) !== -1) {
                console.log('MyChromeExtension doubao.com: 文本填入成功，读回长度 ' + currentText.length);
                callback(true);
                return;
            }
            attempts++;
            console.log('MyChromeExtension doubao.com: 文本填入读回校验失败（读回长度 ' + currentText.length + '），第 ' + attempts + '/' + maxAttempts + ' 次重试');
            if (attempts >= maxAttempts) {
                console.log('MyChromeExtension doubao.com: 文本填入失败，已放弃（读回始终不匹配）');
                callback(false);
                return;
            }
            setTimeout(tryInput, 300);
        }, 50);
    };
    tryInput();
};

// 轮询等待新回复生成完成
var waitForResponse = function (previousText, generation, callback) {
    var lastText = '';
    var stableCount = 0;
    var attempts = 0;
    var maxAttempts = 40;
    var poll = function () {
        attempts++;
        if (generation !== runGeneration) {
            return;
        }
        var response = getLastAssistantResponse();
        var currentText = response && response.text || '';
        if (currentText && currentText !== previousText) {
            if (currentText === lastText) {
                stableCount++;
            } else {
                stableCount = 0;
                lastText = currentText;
            }
            if (stableCount >= 3 && !isGenerating()) {
                callback(currentText);
                return;
            }
        }
        if (attempts >= maxAttempts) {
            console.log('MyChromeExtension doubao.com: 等待回复结束，最后一次文本长度 ' + (currentText || '').length + '，生成中 ' + isGenerating());
            callback(null);
            return;
        }
        setTimeout(poll, 1000);
    };
    setTimeout(poll, 1000);
};

// 从队列取一个请求，交给豆包处理，再把响应写回队列
var runOnce = function () {
    if (isBusy && Date.now() - busySince > busyTimeoutMs) {
        console.log('MyChromeExtension doubao.com: 单轮处理超时，重置运行状态');
        runGeneration++;
        isBusy = false;
    }
    if (isBusy || isGenerating()) {
        return;
    }
    isBusy = true;
    busySince = Date.now();
    var generation = runGeneration;
    fetch(proxyBaseUrl + '/v1/request/get')
        .then(function (resp) {
            if (resp.status === 404) {
                return null;
            }
            if (!resp.ok) {
                throw new Error('HTTP ' + resp.status);
            }
            return resp.json();
        })
        .then(function (pending) {
            if (generation !== runGeneration) {
                return;
            }
            if (!pending) {
                isBusy = false;
                return;
            }
            var requestHash = pending.hash;
            var requestBody = pending.request || {};
            var currentPrompt = '你是一个 LLM 的 Chat Completions API 服务，使用 OpenAI API 协议，并且支持 tools 工具调用。处理以下的 JSON 请求。回复符合 OpenAI API 协议的 JSON 响应。\n'
                + JSON.stringify(requestBody, null, 2);
            startNewChat(generation, function () {
                var previousResponse = getLastAssistantResponse();
                var previousText = previousResponse && previousResponse.text || '';
                console.log('MyChromeExtension doubao.com: 发送前回复文本长度 ' + previousText.length);
                inputPromptText(currentPrompt, generation, function (inputOk) {
                    if (!inputOk) {
                        isBusy = false;
                        return;
                    }
                    console.log('MyChromeExtension doubao.com 输入: ' + currentPrompt);
                    setTimeout(function () {
                        var sendAttempts = 0;
                        var clickSendWhenReady = function () {
                            if (generation !== runGeneration) {
                                return;
                            }
                            var sendButton = findSendButton();
                            if (!sendButton) {
                                sendAttempts++;
                                if (sendAttempts >= 10) {
                                    console.log('MyChromeExtension doubao.com: 未找到可用的发送按钮');
                                    isBusy = false;
                                    return;
                                }
                                setTimeout(clickSendWhenReady, 200);
                                return;
                            }
                            sendButton.click();
                            waitForResponse(previousText, generation, function (text) {
                                if (!text) {
                                    isBusy = false;
                                    console.log('MyChromeExtension doubao.com: 等待回复超时');
                                    return;
                                }
                                console.log('MyChromeExtension doubao.com 输出: ' + text);
                                var jsonText = text.trim();
                                var responseBody;
                                try {
                                    responseBody = JSON.parse(jsonText);
                                } catch (error) {
                                    isBusy = false;
                                    console.log('MyChromeExtension doubao.com: 回复不是合法 JSON，跳过本轮', error);
                                    return;
                                }
                                if (!responseBody || typeof responseBody !== 'object' || Array.isArray(responseBody)) {
                                    isBusy = false;
                                    console.log('MyChromeExtension doubao.com: 回复不是 JSON 对象，跳过本轮');
                                    return;
                                }
                                var responseData = {
                                    hash: requestHash,
                                    prompt: currentPrompt,
                                    text: text,
                                    time: Date.now()
                                };
                                chrome.storage.local.set({ doubaoLastResponse: responseData }, function () {
                                    console.log('MyChromeExtension doubao.com: 回复已保存到 doubaoLastResponse');
                                });
                                document.dispatchEvent(new CustomEvent('MyChromeExtensionDoubaoResponse', { detail: responseData }));
                                fetch(proxyBaseUrl + '/v1/request/handle', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ hash: requestHash, response: responseBody })
                                })
                                    .then(function (resp) {
                                        if (!resp.ok) {
                                            throw new Error('HTTP ' + resp.status);
                                        }
                                        return resp.json();
                                    })
                                    .then(function (result) {
                                        console.log('MyChromeExtension doubao.com: 响应已提交', result);
                                        isBusy = false;
                                    })
                                    .catch(function (error) {
                                        console.log('MyChromeExtension doubao.com: 提交响应失败', error);
                                        isBusy = false;
                                    });
                            });
                        };
                        clickSendWhenReady();
                    }, 300);
                });
            });
        })
        .catch(function (error) {
            if (generation !== runGeneration) {
                return;
            }
            isBusy = false;
            console.log('MyChromeExtension doubao.com: 取请求失败', error);
        });
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
