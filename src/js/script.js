import {
    BASE_DIR
} from '../constants.yml'
// import Sample from '@/lib/Sample';



// document.querySelector('.wrapper').addEventListener('click', () => {
//     console.log(`hello, ${sample.name}. Base directory is ${BASE_DIR}.`);
// });

const ScrollAnimes = [];

ScrollAnimes.push(new ScrollAnime({
    // imgBasePath: "img/07-flip-reveal-guts/",
    imgBasePath: "img/01-hero-lightpass/",
    // totalFrameNumber: 69,
    totalFrameNumber: 145,
    priorityFrames: [0, 46, 68],
    targetCanvasId: 'targetCanvas-1',
    targetScrollArea: 'scrollArea-1',
    imageWidth: 1320,
    imageHeight: 760,
    pixelsPerFrame: 10,
    isAutoResizeScrollArea: true,
    offsetEndPos: $(window).height() * -1,
    keyFrames: [{
            start: 0,
            end: 145,
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
            start: 0,
            end: 30,
            callback: function (progress) {
                $('#animationArea-1 .text1').css({
                    opacity: progress,
                    transform: 'translate(0%,' + ((1 - progress) * 50) + '%)',
                });
            }
        },
        {
            start: 30,
            end: 60,
            callback: function (progress) {
                $('#animationArea-1 .text2').css({
                    opacity: progress,
                    transform: 'translate(0%,' + ((1 - progress) * 50) + '%)',
                });
            }
        },
        {
            start: 90,
            end: 100,
            callback: function (progress) {
                $('#animationArea-1 .text1, #animationArea-1 .text2').css({
                    opacity: 1 - progress,
                    transform: 'translate(0%,' + (progress * -50) + '%)',
                });
            }
        },
        {
            start: 100,
            end: 120,
            callback: function (progress) {
                $('#animationArea-1 .date').css({
                    opacity: progress,
                    letterSpacing: 2 - progress * 2 + 'rem',
                    transform: `scale(${1+ (.5 - progress * .5)})`
                });
            }
        },
        {
            emit: 144,
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