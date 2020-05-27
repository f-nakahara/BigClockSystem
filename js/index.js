var isGame = false;
var clockTimer;
var firstIntervalTime = 5.00; // 白い針の1間隔進む時間
var secondIntervalTime = 1.00; // オレンジ針の1間隔進む時間
var scale = 0.05;
var record = true;

var result = {
    "start": null,
    "term1": null,
    "term2": null,
    "term3": null,
    "term4": null,
    "term5": null
};

var baseScore = {
    "term1": firstIntervalTime * 9 + secondIntervalTime * 5,
    "term2": firstIntervalTime * 9 + secondIntervalTime * 8,
    "term3": firstIntervalTime * 9 + secondIntervalTime * 11,
    "term4": firstIntervalTime * 9 + secondIntervalTime * 13,
    "term5": firstIntervalTime * 9 + secondIntervalTime * 15
}

function pushStartButton() {
    $("#start_btn").on("click", function () {
        hideStartButton();
        showStopButton();
        startClock();
        result["start"] = new Date().getTime();
    })
}

function pushStopButton() {
    $("#stop_btn").on("click", function () {
        var stopTime = new Date().getTime();
        var score = (stopTime - result["start"]) / 1000.00;
        if (result["term1"] == null) {
            result["term1"] = score;
        }
        else if (result["term2"] == null) {
            result["term2"] = score;
        }
        else if (result["term3"] == null) {
            result["term3"] = score
        }
        else if (result["term4"] == null) {
            result["term4"] = score;
        }
        else if (result["term5"] == null) {
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

function pushScaleExpansion() {
    $("#scale_expansion").on("click", function () {
        scale += 0.10;
        scale = (scale >= 0.95) ? 0.95 : scale;
        showResultScore();
    })
}

function pushScaleReducation() {
    $("#scale_education").on("click", function () {
        scale -= 0.10;
        scale = (scale <= 0.05) ? 0.05 : scale;
        showResultScore();
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
            var diff_time = result[term] - baseScore[term];
            diff_time_list[term] = diff_time.toFixed(2);
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
        var diff_time = result[term] - baseScore[term];
        var offset = scale + diff_time;
        var ratio = offset / (scale * 2) * 100.0;
        ratio = (ratio < 0) ? 0 : (ratio > 100) ? 100 : ratio;
        $(`.${term}`).css({
            "width": ratio + "%"
        })
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
            transform: 'rotate(90deg)'
        })
        hideResetButton();
        showStartButton();
        record = true;
    })
}


function startClock() {
    $('#first-hand').animate({ opacity: 2 }, {
        easing: "linear",
        duration: firstIntervalTime * 9 * 1000, // 秒単位に変換
        step: function (now) {
            $(this).css({ transform: 'rotate(' + (now - 90) * 270 + 'deg)' })
        },
        complete: function () {
            $('#second-hand, #first-hand').animate({ opacity: 2 }, {
                easing: "linear",
                duration: secondIntervalTime * 21 * 1000, // 秒単位に変換
                step: function (now) {
                    $(this).css({ transform: 'rotate(' + (now - 45) * (450 + 180) + 'deg)' })
                },
                complete: function () {
                    $("#second-hand").css({
                        transform: "rotate(0deg)"
                    });
                    hideStopButton();
                    showResetButton();
                    showResultScore();
                    sendScore();
                }
            });
        }
    });
}

function stopClock() {
    $("#second-hand, #first-hand").stop();
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

$(function () {
    hideStopButton();
    hideResetButton();
    pushStartButton();
    pushStopButton();
    pushResetButton();
    pushScaleExpansion();
    pushScaleReducation();
})