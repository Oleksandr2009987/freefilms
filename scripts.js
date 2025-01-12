const video = document.getElementById("pirates-video");
const playPauseButton = document.getElementById("play-pause");
const progressBar = document.getElementById("progress-bar");
const volumeControl = document.getElementById("volume");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");
const fullscreenButton = document.getElementById("fullscreen");

const qualityToggle = document.getElementById("quality-toggle");
const qualityOptions = document.getElementById("quality-options");
const qualityDisplay = document.getElementById("quality-display");

const availableQualities = ["144p", "360p", "480p", "720p", "1080p"]; // Доступные качества

let isPlaying = false;
let currentQuality = availableQualities[4]; // По умолчанию качество 1080p

// Функция для форматирования времени
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Обновление времени при загрузке метаданных видео (длительность)
video.addEventListener("loadedmetadata", () => {
    durationDisplay.textContent = formatTime(video.duration);
    progressBar.max = 100; // Обновляем максимальное значение для прогресс бара
});

// Обновление прогресса и текущего времени во время воспроизведения с плавным эффектом
let lastUpdate = 0;
function updateProgress() {
    const currentTime = video.currentTime;
    const duration = video.duration;

    // Плавное обновление прогресса с задержкой для уменьшения дергания
    if (Math.abs(currentTime - lastUpdate) > 0.1) {
        const progress = (currentTime / duration) * 100;
        progressBar.value = progress;
        currentTimeDisplay.textContent = formatTime(currentTime);
        lastUpdate = currentTime;
    }

    if (isPlaying) {
        requestAnimationFrame(updateProgress);
    }
}

video.addEventListener("play", () => {
    isPlaying = true;
    requestAnimationFrame(updateProgress);
});

video.addEventListener("pause", () => {
    isPlaying = false;
});

// Тоггл воспроизведения
playPauseButton.addEventListener("click", () => {
    if (isPlaying) {
        video.pause();
        playPauseButton.textContent = "►"; // Иконка для воспроизведения
    } else {
        video.play();
        playPauseButton.textContent = "❚❚"; // Иконка для паузы
    }
    isPlaying = !isPlaying;
});

// Перемотка видео по ползунку с плавным перемещением
progressBar.addEventListener("input", () => {
    const progress = progressBar.value;
    video.currentTime = (video.duration * progress) / 100;
});

// Управление громкостью
volumeControl.addEventListener("input", () => {
    video.volume = volumeControl.value / 100;
});

// Переключение на полноэкранный режим
fullscreenButton.addEventListener("click", () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        video.requestFullscreen();
    }
});

// Функция для отображения текста в полноэкранном режиме
document.addEventListener("fullscreenchange", () => {
    const freefilmsText = document.getElementById("freefilms-text");
    if (document.fullscreenElement) {
        freefilmsText.style.opacity = "1";  // Текст виден в полноэкранном режиме
    } else {
        freefilmsText.style.opacity = "0.4";  // Текст имеет прозрачность в обычном режиме
    }
});

// Обработчик окончания видео
video.addEventListener("ended", () => {
    video.currentTime = 0;  // Возвращаем видео на первый кадр
    video.pause();          // Ставим видео на паузу
    playPauseButton.textContent = "►"; // Меняем иконку на кнопку play
});

// Тоггл панели выбора качества
qualityToggle.addEventListener("click", () => {
    qualityOptions.classList.toggle("hidden");
});

// Выбор качества
const qualityButtons = document.querySelectorAll(".quality-option");
qualityButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        currentQuality = event.target.dataset.quality;
        document.getElementById("current-quality").textContent = currentQuality;
        video.src = `films/pirates_of_the_caribbean_${currentQuality}.mp4`; // Загрузка видео с выбранным качеством
        video.load(); // Перезагружаем видео с новым источником
        qualityOptions.classList.add("hidden"); // Закрываем панель качества
    });
});

// Запрещаем правый клик на видео
document.addEventListener('contextmenu', event => event.preventDefault());
