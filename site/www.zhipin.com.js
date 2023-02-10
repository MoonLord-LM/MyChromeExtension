typeof (showLoadedFile) === 'function' && showLoadedFile();



// 仅用于 Boss 直聘的 “推荐牛人” 栏目，帮助过滤简历
// 以下参数可以修改：目标院校、目标年龄、目标工作年限、关键词黑名单、关键词必须包含值

// 目标院校
var school_list = [
    '中国科学技术大学',
    '北京大学',
    '清华大学',
    '中国人民大学',
    '北京航空航天大学',
    '北京师范大学',
    '北京理工大学',
    '中国农业大学',
    '中央民族大学',
    '厦门大学',
    '兰州大学',
    '中山大学',
    '华南理工大学',
    '哈尔滨工业大学',
    '华中科技大学',
    '武汉大学',
    '国防科技大学',
    '中南大学',
    '湖南大学',
    '吉林大学',
    '南京大学',
    '东南大学',
    '大连理工大学',
    '东北大学',
    '山东大学',
    '中国海洋大学',
    '西安交通大学',
    '西北工业大学',
    '上海交通大学',
    '复旦大学',
    '同济大学',
    '华东师范大学',
    '电子科技大学',
    '四川大学',
    '南开大学',
    '天津大学',
    '浙江大学',
    '重庆大学',
    '西北农林科技大学',
    '西安电子科技大学',
    '合肥工业大学',
    '安徽大学',
    '中央财经大学',
    '对外经济贸易大学',
    '北京外国语大学',
    '北京邮电大学',
    '中国政法大学',
    '北京交通大学',
    '北京科技大学',
    '北京工业大学',
    '中国传媒大学',
    '北京化工大学',
    '中国地质大学',
    '中国石油大学',
    '北京林业大学',
    '福州大学',
    '暨南大学',
    '华南师范大学',
    '广西大学',
    '贵州大学',
    '海南大学',
    '河北工业大学',
    '郑州大学',
    '哈尔滨工程大学',
    '东北林业大学',
    '东北农业大学',
    '中南财经政法大学',
    '武汉理工大学',
    '华中师范大学',
    '华中农业大学',
    '湖南师范大学',
    '湖南师范大学',
    '延边大学',
    '南京航空航天大学',
    '南京理工大学',
    '苏州大学',
    '河海大学',
    '南京师范大学',
    '江南大学',
    '中国矿业大学',
    '南京农业大学',
    '南昌大学',
    '大连海事大学',
    '辽宁大学',
    '内蒙古大学',
    '宁夏大学',
    '青海大学',
    '太原理工大学',
    '西北大学',
    '长安大学',
    '上海财经大学',
    '上海外国语大学',
    '华东理工大学',
    '上海大学',
    '东华大学',
    '西南财经大学',
    '西南交通大学',
    '四川农业大学',
    '新疆大学',
    '石河子大学',
    '云南大学',
    '西南大学',
    '中国科学院大学',
    '首都师范大学',
    '华南农业大学',
    '河南大学',
    '湘潭大学',
    '南京邮电大学',
    '南京信息工程大学',
    '山西大学',
    '上海科技大学',
    '成都理工大学',
    '天津工业大学',
    '哈尔滨理工大学',
    '西安理工大学',
    '深圳大学',
    '广东工业大学',
    '桂林电子科技大学',
    '西安邮电大学',
    '陕西科技大学',
    '西安科技大学',
    '重庆邮电大学',
];

// 目标年龄
var age_list = [
    '22岁',
    '23岁',
    '24岁',
    '25岁',
    '26岁',
    '27岁',
    '28岁',
    '29岁',
    '30岁',
    '31岁',
    '32岁',
    '33岁',
    '34岁',
]

// 目标工作年限
var year_list = [
    '1年',
    '2年',
    '3年',
    '4年',
    '5年',
    '6年',
    '7年',
    '8年',
    '9年',
    '10年',
]

// 关键词黑名单
var black_list = [
    '学院',
    '大专',
    '3日内活跃',
    '本周活跃',
    '2周内活跃',
    '本月活跃',
    '2月内活跃',
    '3月内活跃',
    '4月内活跃',
    '近半年活跃',
    '半年前活跃',
    '在职-暂不考虑',
    '23年应届生',
    '24年应届生',
    '25年应届生',
    '10年以上',
    '主管',
    '产品经理',
    '算法工程师',
    '运维工程师',
    '售前工程师',
    '华为',
    '腾讯',
    '阿里',
]

// 关键词必须包含值白名单
var white_list = [
    '在线',
    '刚刚活跃',
    '今日活跃',
]



// 以下为代码逻辑：屏蔽页面广告、卡片关键词过滤

// 隐藏左下角广告
var hide_ad = function () {
    var ad = document.querySelector('div.c-menu-bottom-ad');
    var hide_count = 0;
    if(ad !== null) {
        if(ad.style.display !== 'none') {
            ad.style.display = 'none';
            hide_count += 1;
        }
    }
    if(hide_count > 0){
        console.log('hide_ad hide_count: ' + hide_count);
    }
    //console.log('hide_ad is running ...');
};
hide_ad();
setInterval(hide_ad, 3000);

// 关键词检查
var contain_word = function (list, text) {
    for (let i = 0; i < list.length; i++) {
        if (text.indexOf(list[i]) !== -1) {
            return true;
        }
    }
    return false;
}

var check_school = (text) => contain_word(school_list, text); // 检查学校
var check_age = (text) => contain_word(age_list, text); // 检查年龄
var check_year = (text) => contain_word(year_list, text); // 检查年限
var check_black_list = (text) => !contain_word(black_list, text); // 检查黑名单
var check_white_list = (text) => contain_word(white_list, text); // 检查白名单
var check_all = (text) => check_school(text) && check_age(text) && check_year(text) && check_black_list(text) && check_white_list(text); // 全部检查

// 向下拖拽到底部
var scroll_to_end = function () {
    var recommendFrame = document.querySelector('iframe');
    if (recommendFrame === null) {
        console.log('scroll_to_end: error, recommendFrame is null');
        return;
    }
    if (recommendFrame.contentWindow === null) {
        console.log('scroll_to_end: error, recommendFrame.contentWindow is null');
        return;
    }
    if (
        recommendFrame.contentWindow.document.body.innerText.indexOf('没有更多') !== -1 ||
        recommendFrame.contentWindow.document.body.innerText.indexOf('更多牛人资源') !== -1
    ) {
        console.log('scroll_to_end: finish, no more');
        card_filter();
        return;
    }
    if (recommendFrame.contentWindow.document.body.innerText.indexOf('滚动加载更多') !== -1) {
        var before = recommendFrame.contentWindow.scrollY;
        console.log('scroll_to_end before scrollY: ' + before);
        recommendFrame.contentWindow.scrollBy(0, 1000000);
        var after = recommendFrame.contentWindow.scrollY;
        console.log('scroll_to_end after scrollY: ' + after);
    }
    console.log('scroll_to_end is running ...');
};

// 卡片处理
var card_filter = function () {
    var recommendFrame = document.querySelector('iframe');
    if (recommendFrame === null) {
        console.log('card_filter: error, recommendFrame is null');
        return;
    }
    if (recommendFrame.contentWindow === null) {
        console.log('card_filter: error, recommendFrame.contentWindow is null');
        return;
    }
    var cards = recommendFrame.contentWindow.document.querySelectorAll("div.candidate-card-wrap");
    console.log('card_filter before: ' + cards.length);
    for (let i = 0; i < cards.length; i++) {
        var card = cards[i];
        var text = card.innerText;
        if (!check_all(text)) {
            // console.log('card_filter remove: ' + check_school(text) + check_age(text) + check_year(text) + check_black_list(text) + check_white_list(text));
            // console.log('card_filter remove: ' + text);
            card.parentNode.removeChild(card);
            continue;
        }
    }
    cards = recommendFrame.contentWindow.document.querySelectorAll("div.candidate-card-wrap");
    console.log('card_filter after: ' + cards.length);
    console.log('card_filter is running ...');
}

// 定时执行
if (
    window.location.href.startsWith('https://www.zhipin.com/web/boss/recommend') ||
    window.location.href.startsWith('https://www.zhipin.com/web/chat/recommend')
) {
    setInterval(scroll_to_end, 3000);
}


