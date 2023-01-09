typeof (showLoadedFile) === 'function' && showLoadedFile();

// 自动发送弹幕
var send_chat = function () {
    var chat_text = document.querySelector('textarea.ChatSend-txt');
    var chat_button = document.querySelector('div.ChatSend-button');
    if(chat_text !== null && chat_button !== null){
        // chat_text.value = '？？？ ？？？ ？？？ ？？？ ？？？ ？？？';
        // chat_button.click();
    }
    //console.log('send_chat is running ...');
}
send_chat();
setInterval(send_chat, 3000);
