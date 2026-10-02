(function () {
    const REDIRECT_URL = 'https://kentrugit.github.io/';
    const DELAY_SECONDS = 5;

    const countdownEl = document.getElementById('countdown');
    let secondsLeft = DELAY_SECONDS;

    // Начальное значение
    countdownEl.textContent = secondsLeft;

    // Анимация "тика" при каждом обновлении
    function tickEffect() {
        countdownEl.classList.add('tick');
        setTimeout(() => countdownEl.classList.remove('tick'), 300);
    }

    // Уменьшаем счётчик каждую секунду
    const interval = setInterval(() => {
        secondsLeft--;
        if (secondsLeft >= 0) {
            countdownEl.textContent = secondsLeft;
            tickEffect();
        }
        if (secondsLeft <= 0) {
            clearInterval(interval);
            window.location.href = REDIRECT_URL;
        }
    }, 1000);

    // Резервный редирект (на случай сбоя setInterval)
    setTimeout(() => {
        window.location.href = REDIRECT_URL;
    }, (DELAY_SECONDS + 1) * 1000);
})();
