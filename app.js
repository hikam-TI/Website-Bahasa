// App Variables
let userProgress = {
    chapters: {
        1: { completed: 0, total: 5, progress: 0 },
        2: { completed: 0, total: 5, progress: 0 },
        3: { completed: 0, total: 5, progress: 0 }
    },
    games: {
        'tebak-kata': { played: 0, completed: 0 },
        'susun-kalimat': { played: 0, completed: 0 },
        'cari-sinonim': { played: 0, completed: 0 }
    },
    streak: 0,
    lastPlayed: null
};

// Tambahkan data pelajaran per chapter (contoh sederhana)
const lessonsData = {
    1: [
        { title: "Pelajaran 1", content: "Kata dasar: Saya, Kamu, Dia." },
        { title: "Pelajaran 2", content: "Kata dasar: Makan, Minum, Tidur." },
        { title: "Pelajaran 3", content: "Kata dasar: Rumah, Sekolah, Kantor." },
        { title: "Pelajaran 4", content: "Kata dasar: Merah, Biru, Hijau." },
        { title: "Pelajaran 5", content: "Kata dasar: Cepat, Lambat, Bagus." }
    ],
    2: [
        { title: "Pelajaran 1", content: "Tata bahasa: Subjek dan Predikat." },
        { title: "Pelajaran 2", content: "Tata bahasa: Objek dan Keterangan." },
        { title: "Pelajaran 3", content: "Tata bahasa: Kalimat Majemuk." },
        { title: "Pelajaran 4", content: "Tata bahasa: Kata Ganti." },
        { title: "Pelajaran 5", content: "Tata bahasa: Kata Sambung." }
    ],
    3: [
        { title: "Pelajaran 1", content: "Pemahaman bacaan: Membaca teks pendek." },
        { title: "Pelajaran 2", content: "Pemahaman bacaan: Menjawab pertanyaan." },
        { title: "Pelajaran 3", content: "Pemahaman bacaan: Menemukan ide utama." },
        { title: "Pelajaran 4", content: "Pemahaman bacaan: Menyimpulkan isi teks." },
        { title: "Pelajaran 5", content: "Pemahaman bacaan: Membaca teks panjang." }
    ]
};

// Ambil elemen modal pembelajaran dan kontrolnya
const learningModal = document.getElementById('learningModal');
const modalChapterTitle = document.getElementById('modalChapterTitle');
const learningContent = document.getElementById('learningContent');
const prevLessonBtn = document.getElementById('prevLesson');
const nextLessonBtn = document.getElementById('nextLesson');
const completeLessonBtn = document.getElementById('completeLesson');
const lessonCounter = document.getElementById('lessonCounter');
const closeLearningModalBtn = document.getElementById('closeLearningModal');

let currentChapter = null;
let currentLessonIndex = 0;

// Fungsi tampilkan pelajaran saat ini
function showLesson() {
    const lessons = lessonsData[currentChapter];
    if (!lessons) return;

    const lesson = lessons[currentLessonIndex];
    modalChapterTitle.textContent = `Chapter ${currentChapter} - ${lesson.title}`;
    learningContent.textContent = lesson.content;
    lessonCounter.textContent = `Pelajaran ${currentLessonIndex + 1} / ${lessons.length}`;

    prevLessonBtn.style.display = currentLessonIndex === 0 ? 'none' : 'inline-block';
    nextLessonBtn.style.display = currentLessonIndex === lessons.length - 1 ? 'none' : 'inline-block';
    completeLessonBtn.style.display = currentLessonIndex === lessons.length - 1 ? 'inline-block' : 'none';
}

// Modifikasi setupChapterButtons agar buka modal pembelajaran
function setupChapterButtons() {
    chapterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            currentChapter = e.target.getAttribute('data-chapter');
            currentLessonIndex = 0;
            showLesson();
            learningModal.style.display = 'block';
        });
    });
}

// Event tombol navigasi pelajaran
prevLessonBtn.addEventListener('click', () => {
    if (currentLessonIndex > 0) {
        currentLessonIndex--;
        showLesson();
    }
});

nextLessonBtn.addEventListener('click', () => {
    const lessons = lessonsData[currentChapter];
    if (currentLessonIndex < lessons.length - 1) {
        currentLessonIndex++;
        showLesson();
    }
});

completeLessonBtn.addEventListener('click', () => {
    // Tandai pelajaran selesai di progress
    completeLesson(currentChapter);

    showNotification(`Pelajaran chapter ${currentChapter} selesai!`);
    learningModal.style.display = 'none';
    updateProgressUI();
});

// Tutup modal pembelajaran
closeLearningModalBtn.addEventListener('click', () => {
    learningModal.style.display = 'none';
});

// Tutup modal jika klik di luar konten modal
window.addEventListener('click', (e) => {
    if (e.target === learningModal) {
        learningModal.style.display = 'none';
    }
});

// DOM Elements
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const gameModal = document.getElementById('gameModal');
const modalClose = document.getElementById('modalClose');
const gameButtons = document.querySelectorAll('.game-button');
const chapterButtons = document.querySelectorAll('.chapter-button');
const nextQuestionBtn = document.getElementById('nextQuestion');
const finishGameBtn = document.getElementById('finishGame');
const gameOptions = document.getElementById('gameOptions');
const gameFeedback = document.getElementById('gameFeedback');
const progressChart = document.querySelector('.chart');
const chartPercent = document.querySelector('.chart-percent');
const statValues = document.querySelectorAll('.stat-value');
const streakCount = document.querySelector('.streak-count');
const streakCalendar = document.getElementById('streakCalendar');

// Navigation Toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
}

// Close navigation when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Load progress from localStorage if available
    loadProgress();
    
    // Update UI with current progress
    updateProgressUI();
    
    // Set up game buttons
    setupGameButtons();
    
    // Set up chapter buttons
    setupChapterButtons();
    
    // Set up game modal
    setupGameModal();
    
    // Set up calendar
    setupCalendar();
});

// Load progress from localStorage
function loadProgress() {
    const savedProgress = localStorage.getItem('bahasaku-progress');
    if (savedProgress) {
        userProgress = JSON.parse(savedProgress);
    }
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('bahasaku-progress', JSON.stringify(userProgress));
}

// Update progress UI
function updateProgressUI() {
    // Update chapter progress
    Object.keys(userProgress.chapters).forEach(chapterId => {
        const chapter = userProgress.chapters[chapterId];
        const progressFill = document.querySelector(`.chapter-card[data-chapter="${chapterId}"] .progress-fill`);
        const progressPercent = document.querySelector(`.chapter-card[data-chapter="${chapterId}"] .progress-percent`);
        
        if (progressFill && progressPercent) {
            const progress = (chapter.completed / chapter.total) * 100;
            progressFill.style.width = `${progress}%`;
            progressFill.setAttribute('data-progress', progress);
            progressPercent.textContent = `${Math.round(progress)}%`;
        }
    });
    
    // Update overall progress
    const totalCompleted = Object.values(userProgress.chapters).reduce((sum, chapter) => sum + chapter.completed, 0);
    const totalLessons = Object.values(userProgress.chapters).reduce((sum, chapter) => sum + chapter.total, 0);
    const overallProgress = (totalCompleted / totalLessons) * 100;
    
    progressChart.style.background = `conic-gradient(var(--primary-color) ${overallProgress}%, var(--border-color) ${overallProgress}%)`;
    chartPercent.textContent = `${Math.round(overallProgress)}%`;
    
    // Update stats
    const gamesPlayed = Object.values(userProgress.games).reduce((sum, game) => sum + game.played, 0);
    const chaptersCompleted = Object.values(userProgress.chapters).filter(chapter => chapter.completed === chapter.total).length;
    
    statValues[0].textContent = chaptersCompleted;
    statValues[1].textContent = gamesPlayed;
    statValues[2].textContent = userProgress.streak;
    
    // Update streak
    streakCount.textContent = userProgress.streak;
}

// Set up game buttons
function setupGameButtons() {
    gameButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const gameCard = e.target.closest('.game-card');
            const gameId = gameCard.getAttribute('data-game');
            
            // Update modal title
            document.getElementById('modalGameTitle').textContent = gameCard.querySelector('.game-title').textContent;
            
            // Set up game based on type
            setupGame(gameId);
            
            // Show modal
            gameModal.classList.add('show');
        });
    });
}

// Set up chapter buttons
function setupChapterButtons() {
    chapterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const chapterId = e.target.getAttribute('data-chapter');
            
            // Simulate completing a lesson
            completeLesson(chapterId);
            
            // Show success message
            showNotification(`Pelajaran dari chapter ${chapterId} berhasil diselesaikan!`);
        });
    });
}

// Set up game modal
function setupGameModal() {
    // Close modal when clicking on close button
    modalClose.addEventListener('click', () => {
        gameModal.classList.remove('show');
    });
    
    // Close modal when clicking outside
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            gameModal.classList.remove('show');
        }
    });
    
    // Next question button
    nextQuestionBtn.addEventListener('click', () => {
        // For demo purposes, just reset the game options
        resetGameOptions();
        nextQuestionBtn.disabled = true;
        finishGameBtn.style.display = 'none';
        gameFeedback.textContent = '';
    });
    
    // Finish game button
    finishGameBtn.addEventListener('click', () => {
        const gameId = document.getElementById('modalGameTitle').textContent.toLowerCase().replace(' ', '-');
        completeGame(gameId);
        gameModal.classList.remove('show');
        showNotification('Game berhasil diselesaikan!');
    });
}

// Set up calendar
function setupCalendar() {
    // Clear existing calendar
    streakCalendar.innerHTML = '';
    
    // Get current date
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Create calendar days (last 7 days)
    for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        
        const dayElement = document.createElement('div');
        dayElement.classList.add('streak-day');
        dayElement.textContent = day.getDate();
        
        // Mark active days based on streak
        if (i <= userProgress.streak - 1) {
            dayElement.classList.add('active');
        }
        
        streakCalendar.appendChild(dayElement);
    }
}

// Set up game based on type
function setupGame(gameId) {
    // Reset game UI
    resetGameOptions();
    nextQuestionBtn.disabled = true;
    finishGameBtn.style.display = 'none';
    gameFeedback.textContent = '';
    
    // Set up game based on type
    let question, options;
    
    switch (gameId) {
        case 'tebak-kata':
            question = 'Apa sinonim dari kata "Besar"?';
            options = [
                { text: 'Agung', correct: true },
                { text: 'Kecil', correct: false },
                { text: 'Sempit', correct: false },
                { text: 'Pendek', correct: false }
            ];
            break;
        case 'susun-kalimat':
            question = 'Susun kata-kata berikut menjadi kalimat yang benar: "pasar - Ibu - pergi - ke"';
            options = [
                { text: 'Ibu pergi ke pasar', correct: true },
                { text: 'Pergi ibu ke pasar', correct: false },
                { text: 'Ke pasar ibu pergi', correct: false },
                { text: 'Pasar pergi ke ibu', correct: false }
            ];
            break;
        case 'cari-sinonim':
            question = 'Manakah pasangan kata yang merupakan sinonim?';
            options = [
                { text: 'Cepat - Lambat', correct: false },
                { text: 'Tinggi - Rendah', correct: false },
                { text: 'Pintar - Cerdas', correct: true },
                { text: 'Baru - Lama', correct: false }
            ];
            break;
        default:
            question = 'Pertanyaan default';
            options = [
                { text: 'Opsi 1', correct: true },
                { text: 'Opsi 2', correct: false },
                { text: 'Opsi 3', correct: false },
                { text: 'Opsi 4', correct: false }
            ];
    }
    
    // Set question
    document.getElementById('gameQuestion').textContent = question;
    
    // Set options
    const optionElements = document.querySelectorAll('.game-option');
    options.forEach((option, index) => {
        optionElements[index].textContent = option.text;
        optionElements[index].setAttribute('data-correct', option.correct);
        
        // Add click event
        optionElements[index].onclick = function() {
            checkAnswer(this);
        };
    });
}

// Reset game options
function resetGameOptions() {
    const optionElements = document.querySelectorAll('.game-option');
    optionElements.forEach(option => {
        option.classList.remove('correct', 'incorrect');
        option.onclick = null;
    });
}

// Check answer
function checkAnswer(optionElement) {
    const isCorrect = optionElement.getAttribute('data-correct') === 'true';
    const optionElements = document.querySelectorAll('.game-option');
    
    // Disable all options
    optionElements.forEach(option => {
        option.onclick = null;
    });
    
    // Mark correct/incorrect
    if (isCorrect) {
        optionElement.classList.add('correct');
        gameFeedback.textContent = 'Jawaban benar!';
        gameFeedback.style.color = '#10B981';
    } else {
        optionElement.classList.add('incorrect');
        gameFeedback.textContent = 'Jawaban salah. Coba lagi!';
        gameFeedback.style.color = '#EF4444';
        
        // Highlight correct answer
        optionElements.forEach(option => {
            if (option.getAttribute('data-correct') === 'true') {
                option.classList.add('correct');
            }
        });
    }
    
    // Show next button
    nextQuestionBtn.disabled = false;
    finishGameBtn.style.display = 'inline-block';
}

// Complete a lesson
function completeLesson(chapterId) {
    const chapter = userProgress.chapters[chapterId];
    
    if (chapter.completed < chapter.total) {
        chapter.completed++;
        chapter.progress = (chapter.completed / chapter.total) * 100;
        
        // Update streak
        updateStreak();
        
        // Save progress
        saveProgress();
        
        // Update UI
        updateProgressUI();
    }
}

// Complete a game
function completeGame(gameId) {
    const game = userProgress.games[gameId];
    
    game.played++;
    game.completed++;
    
    // Update streak
    updateStreak();
    
    // Save progress
    saveProgress();
    
    // Update UI
    updateProgressUI();
}

// Update streak
function updateStreak() {
    const today = new Date().toDateString();
    const lastPlayed = userProgress.lastPlayed;
    
    if (lastPlayed === today) {
        // Already played today, no change
        return;
    }
    
    if (!lastPlayed) {
        // First time playing
        userProgress.streak = 1;
    } else {
        const lastPlayedDate = new Date(lastPlayed);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastPlayedDate.toDateString() === yesterday.toDateString()) {
            // Played yesterday, increment streak
            userProgress.streak++;
        } else {
            // Missed a day, reset streak
            userProgress.streak = 1;
        }
    }
    
    userProgress.lastPlayed = today;
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#10B981';
    notification.style.color = 'white';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = '0.5rem';
    notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '1000';
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Initialize smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });

});
