var isGame = false;
var clockTimer;
var firstIntervalTime = 5.000; // 白い針の1間隔進む時間
var secondIntervalTime = 1.000; // オレンジ針の1間隔進む時間

var scale_now = 0.030; // スケール幅の実数値
var scale_min = 0.030; // スケール幅の最小値
var scale_max = 0.250; // スケール幅の最大値
var scale_width = 0.020 // スケール増減値
var record = true;
var time;

var result = {
    "start": null,
    "term1": null,
    "term2": null,
    "term3": null,
    "term4": null,
    "term5": null
};

var baseScore = {
    "term1": firstIntervalTime * 1 + secondIntervalTime * 5,
    "term2": firstIntervalTime * 1 + secondIntervalTime * 8,
    "term3": firstIntervalTime * 1 + secondIntervalTime * 11,
    "term4": firstIntervalTime * 1 + secondIntervalTime * 13,
    "term5": firstIntervalTime * 1 + secondIntervalTime * 15
}

function pushStartButton() {
    $("#start_btn").on("click", function () {
        isTap()
        hideStartButton();
        showStopButton();
        startClock();
        result["start"] = new Date().getTime();
    })
}

function pushStopButton() {
    $("#stop_btn").on("click", function () {
        var stopTime = new Date().getTime();
        var score = (stopTime - result["start"]) / 1000.000;
        if (9.5 <= time && time <= 10.5 && result["term1"] == null) {
            result["term1"] = score;
        } else if (12.5 <= time && time <= 13.5 && result["term2"] == null) {
            result["term2"] = score;
        } else if (15.5 <= time && time <= 16.5 && result["term3"] == null) {
            result["term3"] = score;
        } else if (17.5 <= time && time <= 18.5 && result["term4"] == null) {
            result["term4"] = score;
        } else if (19.5 <= time && time <= 20.5 && result["term5"] == null) {
            result["term5"] = score;
            Promise.all([
                stopClock(),
                hideStopButton(),
                showResetButton(),
                showResultScore(),
                sendScore()
            ]);
        }
    })
}

function setScaleMemori() {
    $("#scale_min").text("-" + (scale_now.toFixed(3)));
    $("#scale_max").text("+" + (scale_now.toFixed(3)));
}

function pushScaleExpansion() {
    $("#scale_expansion").on("click", function () {
        scale_now += scale_width;
        scale_now = (scale_now >= scale_max) ? scale_max : scale_now;
        showResultScore();
        setScaleMemori();
    })
}

function pushScaleReducation() {
    $("#scale_education").on("click", function () {
        scale_now -= scale_width;
        scale_now = (scale_now <= scale_min) ? scale_min : scale_now;
        showResultScore();
        setScaleMemori();
    })
}

function sendScore() {
    if (record) {
        record = false;
        var termList = ["term1", "term2", "term3", "term4", "term5"];
        var diff_time_list = {
            "term1": null,
            "term2": null,
            "term3": null,
            "term4": null,
            "term5": null
        };

        for (var term of termList) {
            if (result[term] == "miss!") {
                diff_time_list[term] = "miss!"
            } else {
                var diff_time = result[term] - baseScore[term];
                diff_time_list[term] = diff_time.toFixed(3);
            }
        }
        $.ajax({
            url: "./php/ajax.php",
            type: "post",
            data: {
                "func": "sendScore",
                "diff_time_list": diff_time_list
            }
        })
    }
}

function showResultScore() {
    var termList = ["term1", "term2", "term3", "term4", "term5"];
    for (var term of termList) {
        if (result[term] == "miss!") {
            $(`#${term}_score`).text(result[term]);
            $(`#${term}_score`).css({
                "color": "#000000",
                "font-weight": "normal"
            })
        } else {
            var diff_time = result[term] - baseScore[term];
            var offset = scale_now + diff_time;
            if (-scale_now <= diff_time && diff_time <= scale_now) {
                $(`#${term}_score`).text(diff_time.toFixed(3));
                $(`#${term}_score`).css({
                    "color": "#000000",
                    "font-weight": "normal"
                })
            } else {
                $(`#${term}_score`).text(diff_time.toFixed(3));
                $(`#${term}_score`).css({
                    "color": "#ff0000",
                    "font-weight": "bold"
                })
            }
            // var ratio = offset / (scale_now * 2.000) * 100.000;
            // if (ratio < 0 || ratio > 100) {
            //     ratio = (ratio < 0) ? 0 : (ratio > 100) ? 100 : ratio;
            //     $(`#${term}_score`).text(diff_time.toFixed(3));
            //     $(`#${term}_score`).css({
            //         "color": "#ff0000",
            //         "font-weight": "bold"
            //     })
            // } else {
            //     $(`#${term}_score`).text(diff_time.toFixed(3));
            //     $(`#${term}_score`).css({
            //         "color": "#000000",
            //         "font-weight": "normal"
            //     })
            // }
            // $(`.${term}`).css({
            //     "width": ratio + "%"
            // })
        }
    }
}

function pushResetButton() {
    $("#reset_btn").on("click", function () {
        result = {
            "start": null,
            "term1": null,
            "term2": null,
            "term3": null,
            "term4": null,
            "term5": null
        };
        $("#second-hand").css({
            transform: 'rotate(0deg)'
        })
        $("#first-hand").css({
            transform: 'rotate(330deg)'
        })
        hideResetButton();
        showStartButton();
        record = true;
        $("#term1_score, #term2_score, #term3_score, #term4_score, #term5_score").text("")
    })

}


function startClock() {
    $('#first-hand').animate({
        opacity: 2
    }, {
        easing: "linear",
        duration: firstIntervalTime * 1 * 1000, // 秒単位に変換
        step: function (now) {
            $(this).css({
                transform: 'rotate(' + (now - 2) * (30) + 'deg)'
            })
        },
        complete: function () {
            $('#second-hand, #first-hand').animate({
                opacity: 2
            }, {
                easing: "linear",
                duration: secondIntervalTime * 21 * 1000, // 秒単位に変換
                step: function (now) {

                    $(this).css({
                        transform: 'rotate(' + (now - 1) * (450 + 180) + 'deg)'
                    })
                },
                complete: function () {
                    hideStopButton();
                    showResetButton();
                    showResultScore();
                    sendScore();
                }
            });
        }
    });
}

function isTap() {
    time = 0.0;
    clockTimer = setInterval(function () {
        time += 0.1;
        if (time.toFixed(1) == 10.6) {
            if (result["term1"] == null) {
                result["term1"] = "miss!"
            }
        } else if (time.toFixed(1) == 13.6) {
            if (result["term2"] == null) {
                result["term2"] = "miss!"
            }
        } else if (time.toFixed(1) == 16.6) {
            if (result["term3"] == null) {
                result["term3"] = "miss!"
            }
        } else if (time.toFixed(1) == 18.6) {
            if (result["term4"] == null) {
                result["term4"] = "miss!"
            }
        } else if (time.toFixed(1) == 20.6) {
            if (result["term5"] == null) {
                result["term5"] = "miss!"
                stopClock(),
                    hideStopButton(),
                    showResetButton(),
                    showResultScore(),
                    sendScore()
            }
        }
    }, 100);
}

function stopClock() {
    $("#second-hand, #first-hand").stop();
    clearInterval(clockTimer);
}

function hideStopButton() {
    $("#stop_btn").hide();
}

function showStopButton() {
    $("#stop_btn").show()
}

function hideStartButton() {
    $("#start_btn").hide();
}

function showStartButton() {
    $("#start_btn").show()
}

function hideResetButton() {
    $("#reset_btn").hide();
}

function showResetButton() {
    $("#reset_btn").show();
}

window.addEventListener('touchmove', function (event) {
    event.preventDefault();
});

function setHandSize() {
    var handSize = $("#base-dial").height();
    $("#second-hand").css({
        "border-right": `${handSize}px solid coral`
    })
    $("#first-hand").css({
        "border-right": `${handSize}px solid wheat`
    })

}

function setScorePosition() {
    var clockSize = $(".clock").height();
    var ww = window.innerWidth;
    $("#term1_score").css({
        "left": `${ww/2+clockSize/2-20}px`,
        "top": `${clockSize/4}px`
    });
    $("#term2_score").css({
        "left": `${ww / 2 + clockSize/3}px`,
        "top": `${clockSize}px`
    });
    $("#term3_score").css({
        "left": `${ww/2-clockSize/3*2}px`,
        "top": `${clockSize/6*5}px`
    });
    $("#term4_score").css({
        "left": `${ww/2-clockSize/3*2}px`,
        "top": `${clockSize/6*1.5}px`
    });
    $("#term5_score").css({
        "left": `${ww / 2}px`,
        "top": `${5}px`
    });
}

$(window).resize(function () {
    setHandSize();
    setScorePosition();
});

$(function () {
    setHandSize();
    setScorePosition();
    // showResultScore()
    setScaleMemori()
    hideStopButton();
    hideResetButton();
    pushStartButton();
    pushStopButton();
    pushResetButton();
    pushScaleExpansion();
    pushScaleReducation();
})