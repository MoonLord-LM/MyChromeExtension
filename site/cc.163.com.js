console.log('MyChromeExtension : cc.163.com.js is loaded');

// 重新设置视频区域的边距
var reset_room_container = function () {
    var room_container = document.querySelector('div.main-container div.scrollContainer');
    if(room_container !== null){
        room_container.style.padding = '0 30px';
    }
    // console.log('reset_room_container is running ...');
}
reset_room_container();
setInterval(reset_room_container, 3000);

// 重新设置聊天区域的宽度
var reset_room_info_area = function () {
    var reset_width = '524px';
    var room_main_area = document.querySelector('div.main-container div.scrollContainer div.room-main-container div.main-wrapper div.main-area');
    if(room_main_area !== null){
        room_main_area.style.marginRight = reset_width;
    }
    var room_info_area = document.querySelector('div.main-container div.scrollContainer div.room-main-container div.main-wrapper div.room-info-area');
    if(room_info_area !== null){
        room_info_area.style.width = reset_width;
    }
    // console.log('reset_room_info_area is running ...');
}
reset_room_info_area();
setInterval(reset_room_info_area, 3000);

// 隐藏飘屏的通知
var hide_player_banner = function () {
    var new_player_banner = document.querySelector('div#live-wrapper div.new-player-banner');
    if(new_player_banner !== null){
        new_player_banner.style.display = 'none';
    }
    var player_banner = document.querySelector('div#live-wrapper div.player-banner');
    if(player_banner !== null){
        player_banner.style.display = 'none';
    }
    // console.log('hide_player_banner is running ...');
}
hide_player_banner();
setInterval(hide_player_banner, 3000);

// 隐藏弹窗的广告
var hide_plugin_modal = function () {
    var plugin_modal = document.querySelector('div#pluginModal div.plugin-modal-container div.plugin-modal');
    if(plugin_modal !== null){
        plugin_modal.style.display = 'none';
    }
    // console.log('hide_plugin_modal is running ...');
}
hide_plugin_modal();
setInterval(hide_plugin_modal, 3000);
