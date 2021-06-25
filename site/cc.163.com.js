console.log('MyChromeExtension : cc.163.com.js is loaded');

// 重新设置视频区域的边距
var reset_room_container = function () {
    var room_container = document.querySelector('div.main-container div.scrollContainer');
    if(room_container !== null){
        room_container.style.padding = '0 20px';
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
    var room_tabs = document.querySelector('div.room-info-area div.room-tabs-chat-list div.room-tabs');
    if(room_tabs !== null){
        room_tabs.style.width = '100%';
    }
    // console.log('reset_room_info_area is running ...');
}
reset_room_info_area();
setInterval(reset_room_info_area, 3000);

// 隐藏七日贡献排行榜的背景图
var hide_week_rank_background = function () {
    var week_rank_top = document.querySelector('ul.week-contrib-rank li.week-rank-top');
    if(week_rank_top !== null){
        week_rank_top.style.backgroundImage = 'url()';
        week_rank_top.style.backgroundColor = '#112233';
        console.log('hide_week_rank_background: week_rank_top');
    }
    var week_rank_item_wrap = document.querySelector('ul.week-contrib-rank div.week-rank-item-wrap');
    if(week_rank_item_wrap !== null){
        week_rank_item_wrap.style.backgroundImage = 'url()';
        week_rank_item_wrap.style.backgroundColor = '#112233';
        console.log('hide_week_rank_background: week_rank_item_wrap');
    }
    // console.log('hide_week_rank_background is running ...');
}
hide_week_rank_background();
setInterval(hide_week_rank_background, 3000);

// 隐藏视频上方的飘屏的通知
var hide_player_banner = function () {
    var new_player_banner = document.querySelector('div#live-wrapper div.new-player-banner');
    if(new_player_banner !== null){
        if(new_player_banner.style.display !== 'none') {
            new_player_banner.style.display = 'none';
            console.log('hide_player_banner: new_player_banner');
        }
    }
    var player_banner = document.querySelector('div#live-wrapper div.player-banner');
    if(player_banner !== null){
        if(player_banner.style.display !== 'none') {
            player_banner.style.display = 'none';
            console.log('hide_player_banner: player_banner');
        }
    }
    // console.log('hide_player_banner is running ...');
}
hide_player_banner();
setInterval(hide_player_banner, 3000);

// 隐藏视频下方的用户进入的飘屏的通知
var hide_mounts_banner = function () {
    var mounts_mp4_player = document.querySelector('div.main-area div.player-area div#mounts_mp4_player');
    if(mounts_mp4_player !== null){
        if(mounts_mp4_player.style.display !== 'none' || mounts_mp4_player.style.visibility !== 'hidden') {
            mounts_mp4_player.style.display = 'none';
            mounts_mp4_player.style.visibility = 'hidden';
            console.log('hide_mounts_banner: mounts_mp4_player');
        }
    }
    var mounts_player = document.querySelector('div.main-area div.player-area div#mounts_player');
    if(mounts_player !== null){
        if(mounts_player.style.display !== 'none' || mounts_player.style.visibility !== 'hidden') {
            mounts_player.style.display = 'none';
            mounts_player.style.visibility = 'hidden';
            console.log('hide_mounts_banner: mounts_player');
        }
    }
    var mounts_banner = document.querySelector('div.main-area div.player-area div#mounts_banner');
    if(mounts_banner !== null){
        if(mounts_banner.style.display !== 'none' || mounts_banner.style.visibility !== 'hidden') {
            mounts_banner.style.display = 'none';
            mounts_banner.style.visibility = 'hidden';
            console.log('hide_mounts_banner: mounts_banner');
        }
    }
    var mounts_player_png = document.querySelector('div.main-area div.player-area div#mounts_player_png');
    if(mounts_player_png !== null){
        if(mounts_player_png.style.display !== 'none' || mounts_player_png.style.visibility !== 'hidden') {
            mounts_player_png.style.display = 'none';
            mounts_player_png.style.visibility = 'hidden';
            console.log('hide_mounts_banner: mounts_player_png');
        }
    }
    // console.log('hide_mounts_banner is running ...');
}
hide_mounts_banner();
setInterval(hide_mounts_banner, 3000);

// 隐藏弹窗的抽奖暴击率的广告
var hide_plugin_modal = function () {
    var plugin_modal = document.querySelector('div#pluginModal div.plugin-modal-container div.plugin-modal div');
    if(plugin_modal !== null){
        if(plugin_modal.style.display !== 'none') {
            plugin_modal.style.display = 'none';
            console.log('hide_plugin_modal: plugin_modal');
        }
    }
    // console.log('hide_plugin_modal is running ...');
}
hide_plugin_modal();
setInterval(hide_plugin_modal, 3000);

// 隐藏未登录的弹窗提示
var hide_vbr_limit_alert = function () {
    var vbr_limit_alert = document.querySelector('div.main-area div.player-area div#vbr-limit-alert');
    if(vbr_limit_alert !== null){
        if(vbr_limit_alert.style.display !== 'none') {
            vbr_limit_alert.style.display = 'none';
            console.log('hide_vbr_limit_alert: vbr_limit_alert');
        }
    }
    // console.log('hide_vbr_limit_alert is running ...');
}
hide_vbr_limit_alert();
setInterval(hide_vbr_limit_alert, 3000);

// 隐藏礼物特效和千里传音
var hide_gift_banner = function () {
    var gift_simple_banner = document.querySelector('div#chat-list-con div.chat-list-wrap div.gift-simp-banner');
    if(gift_simple_banner !== null){
        if(gift_simple_banner.style.display !== 'none') {
            gift_simple_banner.style.display = 'none';
            console.log('hide_gift_banner: gift_simple_banner');
        }
    }
    var gift_banner = document.querySelector('div#chat-list-con div.chat-list-wrap div.gift-banner');
    if(gift_banner !== null){
        if(gift_banner.style.display !== 'none') {
            gift_banner.style.display = 'none';
            console.log('hide_gift_banner: gift_banner');
        }
    }
    // console.log('hide_gift_banner is running ...');
}
hide_gift_banner();
setInterval(hide_gift_banner, 3000);
