const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { alpha: false });
const asciiDisplay = document.getElementById('ascii');

// 100 символов — золотая середина для производительности телефона
const width = 100; 
const height = 48; 
const chars = " .:-=+*#%@";

canvas.width = width;
canvas.height = height;

function renderFrame() {
    if (video.paused || video.ended) return;

    // Отрисовка текущего кадра в Canvas
    ctx.drawImage(video, 0, 0, width, height);
    
    try {
        const pixels = ctx.getImageData(0, 0, width, height).data;
        let asciiFrame = "";

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                // Формула яркости (grayscale)
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                const brightness = (r + g + b) / 3;
                
                const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
                asciiFrame += chars[charIndex];
            }
            asciiFrame += "\n";
        }

        asciiDisplay.textContent = asciiFrame;
    } catch (e) {
        console.error("Критическая ошибка отрисовки:", e);
    }

    requestAnimationFrame(renderFrame);
}

// Универсальный обработчик клика/тапа
const startEngine = () => {
    if (video.paused) {
        video.play().then(() => {
            renderFrame();
        }).catch(err => {
            asciiDisplay.textContent = "Ошибка: тапни еще раз";
            console.error(err);
        });
    } else {
        video.pause();
    }
};

document.body.addEventListener('click', startEngine);
document.body.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Предотвращаем двойной тап на зум
    startEngine();
}, { passive: false });

// Проверка ошибок видео
video.addEventListener('error', () => {
    asciiDisplay.textContent = "Ошибка видеофайла. Проверь формат!";
});
