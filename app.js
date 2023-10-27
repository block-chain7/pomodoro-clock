document.addEventListener("DOMContentLoaded", function() {
    const breakLength = document.getElementById("break-length");
    const sessionLength = document.getElementById("session-length");
    const timerLabel = document.getElementById("timer-label");
    const timeLeft = document.getElementById("time-left");
    const startStop = document.getElementById("start_stop");
    const reset = document.getElementById("reset");
    const beep = document.getElementById("beep");

    let breakValue = parseInt(breakLength.innerText);
    let sessionValue = parseInt(sessionLength.innerText);
    let timer;
    let isRunning = false;
    let isBreak = false;

    function updateDisplay() {
        if (isBreak) {
            timerLabel.innerText = "Break";
            timeLeft.innerText = formatTime(breakValue * 60);
        } else {
            timerLabel.innerText = "Session";
            timeLeft.innerText = formatTime(sessionValue * 60);
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
        const displaySeconds = remainderSeconds < 10 ? "0" + remainderSeconds : remainderSeconds;
        return displayMinutes + ":" + displaySeconds;
    }

    function startTimer() {
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
        } else {
            timer = setInterval(function() {
                if (isBreak) {
                    if (breakValue > 0) {
                        breakValue--;
                        timeLeft.innerText = formatTime(breakValue * 60);
                    } else {
                        beep.play();
                        isBreak = false;
                        breakValue = parseInt(breakLength.innerText);
                        timeLeft.innerText = formatTime(sessionValue * 60);
                    }
                } else {
                    if (sessionValue > 0) {
                        sessionValue--;
                        timeLeft.innerText = formatTime(sessionValue * 60);
                    } else {
                        beep.play();
                        isBreak = true;
                        sessionValue = parseInt(sessionLength.innerText);
                        timeLeft.innerText = formatTime(breakValue * 60);
                    }
                }
            }, 1000);
            isRunning = true;
        }
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        isBreak = false;
        beep.pause();
        beep.currentTime = 0;
        breakValue = parseInt(breakLength.innerText);
        sessionValue = parseInt(sessionLength.innerText);
        updateDisplay();
    }

    function decrement(element, value) {
        if (value > 1) {
            value--;
            element.innerText = value;
            if (!isRunning) updateDisplay();
        }
    }

    function increment(element, value) {
        if (value < 60) {
            value++;
            element.innerText = value;
            if (!isRunning) updateDisplay();
        }
    }

    updateDisplay();

    document.getElementById("break-decrement").addEventListener("click", () => decrement(breakLength, breakValue));
    document.getElementById("break-increment").addEventListener("click", () => increment(breakLength, breakValue));
    document.getElementById("session-decrement").addEventListener("click", () => decrement(sessionLength, sessionValue));
    document.getElementById("session-increment").addEventListener("click", () => increment(sessionLength, sessionValue));
    startStop.addEventListener("click", startTimer);
    reset.addEventListener("click", resetTimer);
});
