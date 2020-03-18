import {
    BASE_DIR
} from '../constants.yml'

const ScrollAnimes = [];

ScrollAnimes.push(new ScrollAnime({
    imgBasePath: "img/glasses/",
    totalFrameNumber: 85,
    priorityFrames: [0, 46, 68],
    targetCanvasId: 'targetCanvas-1',
    targetScrollArea: 'scrollArea-1',
    imageWidth: 1320,
    imageHeight: 990,
    pixelsPerFrame: 15,
    isAutoResizeScrollArea: true,
    offsetEndPos: $(window).height() * -1,
    keyFrames: [
        {
            emit: 3,
            callback: function (isReverse) {
                $('#animationArea-1 .arrow').addClass('fadeOut');
            }
        },{
            start: 0,
            end: 85,
            callback: function (progress) {
                $('#animationArea-1 .text1').css({
                    backgroundPositionX: progress * 300 + '%'
                });
                $('#animationArea-1 .text2').css({
                    backgroundPositionX: progress * 300 + 10 + '%'
                });
                $('#animationArea-1 .date').css({
                    backgroundPositionX: progress * 300 + 10 + '%'
                });
            }
        }, {
            start: 20,
            end: 25,
            callback: function (progress) {
                $('#animationArea-1 .text1').css({
                    opacity: progress,
                    transform: 'translate(0%,' + ((1 - progress) * 50) + '%)',
                });
            }
        },
        {
            start: 35,
            end: 40,
            callback: function (progress) {
                $('#animationArea-1 .text2').css({
                    opacity: progress,
                    transform: 'translate(0%,' + ((1 - progress) * 50) + '%)',
                });
            }
        },
        {
            start: 50,
            end: 60,
            callback: function (progress) {
                $('#animationArea-1 .text1, #animationArea-1 .text2').css({
                    opacity: 1 - progress,
                    transform: 'translate(0%,' + (progress * -50) + '%)',
                });
            }
        },
        {
            start: 60,
            end: 67,
            callback: function (progress) {
                $('#animationArea-1 .date').css({
                    opacity: progress,
                    letterSpacing: 2 - progress * 2 + 'rem',
                    transform: `scale(${1+ (.5 - progress * .5)})`
                });
            }
        },
        {
            start: 17,
            end: 67,
            callback: function (progress) {
                $('#targetCanvas-1').css({
                    // transform: `rotate(${progress * 720}deg)`
                    transform: `rotate(${progress * 1080}deg)`
                });
            }
        },
        {
            emit: 85,
            callback: function (isReverse) {
                $('#animationArea-1 .credit').toggleClass('fadeIn');
            }
        },
    ]
}));


// 初期表示
for (let i = 0; i < ScrollAnimes.length; i++) {
    ScrollAnimes[i].getPriorityFrames();
    ScrollAnimes[i].displayFirstImage();
}

// 画面内の画像を優先的に読み込み
for (let i = 0; i < ScrollAnimes.length; i++) {
    // スクロール位置を取得
    var scrollTop = $(window).scrollTop();
    var scrollBtm = scrollTop + $(window).height();

    // 対象要素の位置を取得
    var targetTop = $('#' + ScrollAnimes[i].targetScrollArea).offset().top;
    var targetBtm = targetTop + $('#' + ScrollAnimes[i].targetScrollArea).height();

    // 画面内にあるかを判定
    const isInView = (scrollBtm > targetTop && scrollTop < targetBtm) ? true : false;
    if (isInView) {
        ScrollAnimes[i].init();
    }
}
for (let i = 0; i < ScrollAnimes.length; i++) {
    if (!ScrollAnimes[i].isInited) {
        ScrollAnimes[i].init();
    }
}