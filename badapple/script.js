const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const asciiDisplay = document.getElementById('ascii');

// Настройки разрешения (для телефона 80-100 — оптимально)
const width = 100; 
const height = 48; 
const chars = " .:-=+*#%@";

canvas.width = width;
canvas.height = height;

function renderFrame() {
    if (video.paused || video.ended) return;

    ctx.drawImage(video, 0, 0, width, height);
    const pixels = ctx.getImageData(0, 0, width, height).data;
    let asciiFrame = "";

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
            asciiFrame += chars[charIndex];
        }
        asciiFrame += "\n";
    }

    asciiDisplay.textContent = asciiFrame;
    requestAnimationFrame(renderFrame);
}

// Обработка клика
document.body.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        renderFrame();
    } else {
        video.pause();
    }
});
