const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
// Добавляем параметр для оптимизации отрисовки в Firefox
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const asciiDisplay = document.getElementById('ascii');

const width = 100; 
const height = 48; 
const chars = " .:-=+*#%@";

canvas.width = width;
canvas.height = height;

function renderFrame() {
    if (video.paused || video.ended) return;

    // Рисуем кадр
    ctx.drawImage(video, 0, 0, width, height);
    
    try {
        const pixels = ctx.getImageData(0, 0, width, height).data;
        let asciiFrame = "";

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const brightness = (pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114);
                const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
                asciiFrame += chars[charIndex];
            }
            asciiFrame += "\n";
        }
        asciiDisplay.textContent = asciiFrame;
    } catch (e) {
        // Если Firefox ругается на безопасность
        console.error("Security/Draw Error:", e);
    }

    requestAnimationFrame(renderFrame);
}

// Слушатель события начала проигрывания для Firefox
video.addEventListener('playing', () => {
    renderFrame();
});

const startEngine = () => {
    if (video.paused) {
        // В Firefox на Android видео должно быть "взаимодействовано" пользователем
        video.play().catch(err => {
            asciiDisplay.textContent = "Ошибка запуска. Попробуй еще раз.";
        });
    } else {
        video.pause();
    }
};

document.body.addEventListener('click', startEngine);
// Для мобильного Firefox используем touchstart
document.body.addEventListener('touchstart', (e) => {
    startEngine();
}, { passive: true });
