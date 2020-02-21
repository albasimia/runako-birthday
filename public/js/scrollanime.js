(function (window, document, undefined) {
    var _ScrollAnime = function (opts) {
        // Defaults
        this.images = [];
        this.imgBasePath = "";
        this.totalFrameNumber = 0;
        this.priorityFrames = [];
        this.targetCanvasId = null;
        this.targetScrollArea = null;
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.pixelsPerFrame = 6;
        this.offsetStartPos = 0;
        this.offsetEndPos = 0;
        this.isAutoResizeScrollArea = false;
        this.keyFrames = [];

        this.isInited = false;
        this.correntFrameNum = 0;

        // Override defaults
        if (opts) {
            for (var opt in opts) {
                this[opt] = opts[opt];
            }
        }
        // スクロールエリアの初期化
        this.scrollArea = $('#' + this.targetScrollArea);
    };
    _ScrollAnime.prototype = {
        init: function () {
            var self = this;
            // 優先して表示するフレームを取得
            self.getPriorityFrames();

            if (!self.cvs.width) {
                // 最初の1枚を表示
                self.displayFirstImage();
            }

            // 初期表示時のkeyframeを実行
            for (let i = 0; i < self.keyFrames.length; i++) {
                if (self.keyFrames[i].start != null) {
                    if (self.correntFrameNum > self.keyFrames[i].end) {
                        self.keyFrames[i].callback(1);
                    } else if (self.keyFrames[i].start <= self.correntFrameNum && self.correntFrameNum <= self.keyFrames[i].end) {
                        self.keyFrames[i].callback(self.getProgress(self.keyFrames[i].start, self.keyFrames[i].end));
                    }
                }
                if (self.keyFrames[i].emit != null) {
                    if (self.keyFrames[i].emit <= self.correntFrameNum) {
                        self.keyFrames[i].callback(false);
                        self.keyFrames[i].emited = true;
                    }
                }
            }

            // 残りの画像を取得
            for (let i = 0; i < self.totalFrameNumber; i++) {
                if (self.priorityFrames.indexOf(i) >= 0) {
                    continue;
                }
                const img = new Image();

                // ロードが終わった画像が現在表示すべき画像に近ければ描画
                $(img).on('load', function () {
                    self.displayNearestImage(self.images);
                });
                img.src = self.getImagePath(i);
                self.images[i] = img;
            }
            // スクロール位置に応じてcanvasに画像を描画
            let ticking = false;
            let beforIndex = 0;
            let isReverse = false;
            document.addEventListener('scroll', function () {
                if (!ticking) {
                    requestAnimationFrame(function () {
                        ticking = false;
                        const top = Math.round($(window).scrollTop() - self.scrollArea.offset().top - self.offsetStartPos);
                        const index = Math.round(top / ((self.scrollArea.height() - self.offsetStartPos + self.offsetEndPos) / self.totalFrameNumber));
                        isReverse = index < beforIndex ? true : false;
                        for (let i = 0; i <= Math.abs(index - beforIndex); i++) {
                            self.correntFrameNum = beforIndex + i * ((index - beforIndex) / Math.abs(index - beforIndex));
                            if (0 <= top && self.correntFrameNum < self.totalFrameNumber && self.images[self.correntFrameNum]) {
                                self.ctx.drawImage(self.images[self.correntFrameNum], 0, 0, self.cvs.width, self.cvs.height);
                            } else if (self.correntFrameNum > self.totalFrameNumber) {
                                self.ctx.drawImage(self.images[self.totalFrameNumber - 1], 0, 0, self.cvs.width, self.cvs.height);
                                self.correntFrameNum = self.totalFrameNumber;
                            } else if (self.correntFrameNum <= 0) {
                                self.ctx.drawImage(self.images[0], 0, 0, self.cvs.width, self.cvs.height);
                                self.correntFrameNum = 0;
                            }

                            // keyFrameの処理
                            for (let i = 0; i < self.keyFrames.length; i++) {
                                if (self.keyFrames[i].start != null) {
                                    if (self.keyFrames[i].start <= self.correntFrameNum && self.correntFrameNum <= self.keyFrames[i].end) {
                                        self.keyFrames[i].callback(self.getProgress(self.keyFrames[i].start, self.keyFrames[i].end));
                                    }
                                }
                                if (self.keyFrames[i].emit) {
                                    if (self.keyFrames[i].emit <= index && !self.keyFrames[i].emited) {
                                        self.keyFrames[i].callback(isReverse);
                                        self.keyFrames[i].emited = true;
                                    } else if (self.keyFrames[i].emit > index && self.keyFrames[i].emited) {
                                        self.keyFrames[i].callback(isReverse);
                                        self.keyFrames[i].emited = false;
                                    }
                                }
                            }
                        }
                        beforIndex = index;
                    });
                    ticking = true;
                }
            }, {
                passive: true
            });

            if (self.isAutoResizeScrollArea) {
                $(window).on('resize', function () {
                    self.resizeTraget();
                });
            }

            self.isInited = true;
        },
        getImagePath: function (num) {
            let imgnum = ('0000' + num).slice(-4);
            return this.imgBasePath + imgnum + ".jpg";
        },
        getPriorityFrames: function () {
            // 優先して表示するフレームを取得
            for (let i = 0; i < this.priorityFrames.length; i++) {
                let img = new Image();
                img.src = this.getImagePath(this.priorityFrames[i]);
                this.images[this.priorityFrames[i]] = img; // 再読み込みを防ぐためにimg要素を配列に保持
            }
        },
        displayFirstImage: function () {
            const self = this;
            // canvasの初期化
            self.cvs = $('#' + self.targetCanvasId)[0];
            self.ctx = self.cvs.getContext('2d', {
                alpha: false
            });
            self.cvs.width = self.imageWidth;
            self.cvs.height = (self.imageHeight * self.imageWidth) / self.imageWidth;
            if (self.isAutoResizeScrollArea) {
                self.resizeTraget();
            }

            // 最初の1枚を表示
            let firstFrameImg = new Image();
            firstFrameImg.onload = function () {
                self.ctx.drawImage(firstFrameImg, 0, 0, self.cvs.width, self.cvs.height);
            };
            let diff = [];
            let nearestIndex = 0;
            const top = Math.round($(window).scrollTop() - self.scrollArea.offset().top - self.offsetStartPos);
            const index = Math.round(top / ((self.scrollArea.height() - self.offsetStartPos + self.offsetEndPos) / self.totalFrameNumber));
            $(this.priorityFrames).each(function (i, val) {
                diff[i] = Math.abs(index - val);
                nearestIndex = (diff[nearestIndex] < diff[i]) ? nearestIndex : i;
            }); // 現在位置に最も近いpriorityFramesを判定
            firstFrameImg.src = this.getImagePath(this.priorityFrames[nearestIndex]);
            if (0 < index && index > self.correntFrameNum) {
                this.correntFrameNum = index;
            } else if (index > self.totalFrameNumber) {
                this.correntFrameNum = self.totalFrameNumber;
            } else if (index <= 0) {
                this.correntFrameNum = 0;
            }
        },
        displayNearestImage: function (imgArray) {
            const self = this;
            let diff = [];
            let nearestIndex = 0;
            const top = Math.round($(window).scrollTop() - self.scrollArea.offset().top - self.offsetStartPos);
            const index = Math.round(top / ((self.scrollArea.height() - self.offsetStartPos + self.offsetEndPos) / self.totalFrameNumber));
            $(imgArray).each(function (i, val) {
                diff[i] = Math.abs(index - i);
                nearestIndex = (diff[nearestIndex] < diff[i]) ? nearestIndex : i;
            });
            self.ctx.drawImage(imgArray[nearestIndex], 0, 0, self.cvs.width, self.cvs.height);
        },
        getProgress: function (start, end) {
            const keyFrameDuration = end - start;
            const keyFrameElapsed = this.correntFrameNum - start;
            let progress = keyFrameElapsed / keyFrameDuration;
            if (progress < 0) {
                progress = 0;
            } else if (progress > 1) {
                progress = 1;
            }
            return progress;
        },
        resizeTraget: function () {
            const self = this;
            if (self.pixelsPerFrame > 0) {
                self.scrollArea.css({
                    height: (self.totalFrameNumber * self.pixelsPerFrame) + $('#' + self.targetCanvasId).height() - self.offsetStartPos + 'px'
                });
            }
        }
    };

    window.ScrollAnime = _ScrollAnime;
})(window, document);