const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.width && canvas.getContext('2d', { willReadFrequently: true });
const asciiDisplay = document.getElementById('ascii');

const width = 120; // Ширина в символах
const height = 60; // Высота в символах
const chars = " .:-=+*#%@";

canvas.width = width;
canvas.height = height;

function renderFrame() {
    if (video.paused || video.ended) return;

    // Рисуем текущий момент видео на невидимый холст
    ctx.drawImage(video, 0, 0, width, height);
    
    // Берем данные о пикселях
    const pixels = ctx.getImageData(0, 0, width, height).data;
    let asciiFrame = "";

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            // Считаем среднюю яркость (R+G+B)/3
            const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
            asciiFrame += chars[charIndex];
        }
        asciiFrame += "\n";
    }

    asciiDisplay.textContent = asciiFrame;
    requestAnimationFrame(renderFrame);
}

document.body.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        renderFrame();
    } else {
        video.pause();
    }
});