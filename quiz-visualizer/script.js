(function() {
    const themes = ['light', 'dark', 'high-contrast'];
    const STORAGE_KEY = 'quiz-visualizer-state';
    const THEME_KEY = 'quiz-visualizer-theme';

    let currentThemeIndex = 0;
    let quizData = null;
    let completedQuestions = new Set();
    let currentQuestion = null;

    const mainView = document.getElementById('main-view');
    const questionView = document.getElementById('question-view');
    const answerView = document.getElementById('answer-view');
    const categoriesContainer = document.getElementById('categories-container');
    const themeToggle = document.getElementById('theme-toggle');
    const fullscreenToggle = document.getElementById('fullscreen-toggle');

    const quizDataInline = {
  "categories": [
    {
      "name": "Geography",
      "questions": [
        {
          "id": "geo-1",
          "difficulty": 1,
          "question": {
            "text": "What is the capital of France?",
            "image": null
          },
          "answer": {
            "text": "Paris",
            "image": null
          }
        },
        {
          "id": "geo-2",
          "difficulty": 2,
          "question": {
            "text": "Which river is the longest in the world?",
            "image": null
          },
          "answer": {
            "text": "The Nile",
            "image": null
          }
        },
        {
          "id": "geo-3",
          "difficulty": 3,
          "question": {
            "text": "What is the smallest country in the world by area?",
            "image": null
          },
          "answer": {
            "text": "Vatican City",
            "image": null
          }
        }
      ]
    },
    {
      "name": "Science",
      "questions": [
        {
          "id": "sci-1",
          "difficulty": 1,
          "question": {
            "text": "What planet is known as the Red Planet?",
            "image": null
          },
          "answer": {
            "text": "Mars",
            "image": null
          }
        },
        {
          "id": "sci-2",
          "difficulty": 2,
          "question": {
            "text": "What is the chemical symbol for gold?",
            "image": null
          },
          "answer": {
            "text": "Au",
            "image": null
          }
        },
        {
          "id": "sci-3",
          "difficulty": 3,
          "question": {
            "text": "What is the speed of light in a vacuum (rounded)?",
            "image": null
          },
          "answer": {
            "text": "300,000 km/s",
            "image": null
          }
        }
      ]
    },
    {
      "name": "History",
      "questions": [
        {
          "id": "his-1",
          "difficulty": 1,
          "question": {
            "text": "In which year did World War II end?",
            "image": null
          },
          "answer": {
            "text": "1945",
            "image": null
          }
        },
        {
          "id": "his-2",
          "difficulty": 2,
          "question": {
            "text": "Who was the first President of the United States?",
            "image": null
          },
          "answer": {
            "text": "George Washington",
            "image": null
          }
        },
        {
          "id": "his-3",
          "difficulty": 3,
          "question": {
            "text": "Which ancient wonder was located in Alexandria?",
            "image": null
          },
          "answer": {
            "text": "The Lighthouse (Pharos)",
            "image": null
          }
        }
      ]
    }
  ]
};

    function init() {
        loadState();
        detectSystemTheme();
        applyTheme(currentThemeIndex);
        loadQuizData();
        setupEventListeners();
    }

    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const state = JSON.parse(saved);
                completedQuestions = new Set(state.completedQuestions || []);
            }
        } catch (e) {
            console.warn('Could not load state:', e);
        }
    }

    function saveState() {
        try {
            const state = {
                completedQuestions: Array.from(completedQuestions)
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save state:', e);
        }
    }

    function detectSystemTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (!savedTheme) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            currentThemeIndex = prefersDark ? 1 : 0;
        } else {
            currentThemeIndex = themes.indexOf(savedTheme);
            if (currentThemeIndex === -1) currentThemeIndex = 0;
        }
    }

    function applyTheme(index) {
        currentThemeIndex = index % themes.length;
        const theme = themes[currentThemeIndex];
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    function toggleTheme() {
        applyTheme(currentThemeIndex + 1);
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(e => {
                console.warn('Fullscreen not supported:', e);
            });
        } else {
            document.exitFullscreen();
        }
    }

    function loadQuizData() {
        quizData = quizDataInline;
        renderMainView();
    }

    function renderMainView() {
        if (!quizData) return;

        categoriesContainer.innerHTML = '';

        quizData.categories.forEach(category => {
            const categoryEl = document.createElement('div');
            categoryEl.className = 'category';

            const title = document.createElement('h2');
            title.textContent = category.name;
            categoryEl.appendChild(title);

            const questionsGrid = document.createElement('div');
            questionsGrid.className = 'questions-grid';

            category.questions.forEach(question => {
                const panel = document.createElement('div');
                panel.className = 'question-panel';
                panel.dataset.id = question.id;

                if (completedQuestions.has(question.id)) {
                    panel.classList.add('completed');
                }

                const difficulty = document.createElement('div');
                difficulty.className = 'difficulty-indicator';

                for (let i = 1; i <= 5; i++) {
                    const dot = document.createElement('span');
                    dot.className = 'difficulty-dot';
                    if (i <= question.difficulty) {
                        dot.classList.add('filled');
                    }
                    difficulty.appendChild(dot);
                }

                panel.appendChild(difficulty);
                panel.addEventListener('click', () => handleQuestionClick(question));
                questionsGrid.appendChild(panel);
            });

            categoryEl.appendChild(questionsGrid);
            categoriesContainer.appendChild(categoryEl);
        });
    }

    function handleQuestionClick(question) {
        if (completedQuestions.has(question.id)) return;

        currentQuestion = question;
        showQuestionView(question);
    }

    function showQuestionView(question) {
        document.getElementById('question-text').textContent = question.question.text;

        const img = document.getElementById('question-image');
        if (question.question.image) {
            img.src = question.question.image;
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
        }

        switchView(questionView);
    }

    function showAnswerView() {
        if (!currentQuestion) return;

        document.getElementById('answer-text').textContent = currentQuestion.answer.text;

        const img = document.getElementById('answer-image');
        if (currentQuestion.answer.image) {
            img.src = currentQuestion.answer.image;
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
        }

        switchView(answerView);
    }

    function returnToMain() {
        if (currentQuestion) {
            completedQuestions.add(currentQuestion.id);
            saveState();

            const panel = document.querySelector(`.question-panel[data-id="${currentQuestion.id}"]`);
            if (panel) {
                panel.classList.add('completed');
            }
        }

        currentQuestion = null;
        switchView(mainView);
    }

    function switchView(view) {
        mainView.classList.remove('active');
        questionView.classList.remove('active');
        answerView.classList.remove('active');
        view.classList.add('active');
    }

    function setupEventListeners() {
        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTheme();
        });

        fullscreenToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFullscreen();
        });

        questionView.addEventListener('click', () => {
            showAnswerView();
        });

        answerView.addEventListener('click', () => {
            returnToMain();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 't' || e.key === 'T') {
                toggleTheme();
            } else if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen();
            } else if (e.key === 'Escape') {
                returnToMain();
            } else if (e.key === ' ' && questionView.classList.contains('active')) {
                e.preventDefault();
                showAnswerView();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
