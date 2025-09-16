document.addEventListener('DOMContentLoaded', () => {

    // Global Game State
    const gameData = {
        teams: [{
            name: 'Team 1',
            score: 0
        }, {
            name: 'Team 2',
            score: 0
        }],
        questions: [
            // Category 1
            ["Placeholder question 1-1", "Placeholder question 1-2", "Placeholder question 1-3", "Placeholder question 1-4", "Placeholder question 1-5"],
            // Category 2
            ["Placeholder question 2-1", "Placeholder question 2-2", "Placeholder question 2-3", "Placeholder question 2-4", "Placeholder question 2-5"],
            // Category 3
            ["Placeholder question 3-1", "Placeholder question 3-2", "Placeholder question 3-3", "Placeholder question 3-4", "Placeholder question 3-5"]
        ],
        answeredQuestions: 0,
        currentQuestionValue: 0,
        currentQuestionBox: null
    };

    // DOM Elements
    const screens = document.querySelectorAll('.screen');
    const startButton = document.getElementById('start-button');
    const teamSetupScreen = document.getElementById('team-setup');
    const startGameButton = document.getElementById('start-game-button');
    const team1NameInput = document.getElementById('team1-name');
    const team2NameInput = document.getElementById('team2-name');
    const team1NameDisplay = document.getElementById('team1-name-display');
    const team2NameDisplay = document.getElementById('team2-name-display');
    const team1NameModal = document.getElementById('team1-name-modal');
    const team2NameModal = document.getElementById('team2-name-modal');
    const questionBoxes = document.querySelectorAll('.question-box');
    const questionModal = document.getElementById('question-modal');
    const questionText = document.getElementById('question-text');
    const team1CorrectButton = document.getElementById('team1-correct-button');
    const team1IncorrectButton = document.getElementById('team1-incorrect-button');
    const team2CorrectButton = document.getElementById('team2-correct-button');
    const team2IncorrectButton = document.getElementById('team2-incorrect-button');
    const finalScreen = document.getElementById('final-screen');
    const winnerText = document.getElementById('winner-text');
    const finalScoreTeam1 = document.getElementById('final-score-team1');
    const finalScoreTeam2 = document.getElementById('final-score-team2');
    const playAgainButton = document.getElementById('play-again-button');
    const bouncingContainer = document.getElementById('bouncing-images-container');
    const imagesToBounce = ['image1.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png', 'image6.png', 'image7.png', 'image8.png', 'image9.png', 'image10.png'];
    let imagesAdded = 0;

    // --- Screen and Game Flow Functions ---
    const switchScreen = (targetId) => {
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(targetId).classList.add('active');
    };

    startButton.addEventListener('click', () => {
        switchScreen('team-setup');
    });

    startGameButton.addEventListener('click', () => {
        const team1Name = team1NameInput.value.trim() || 'TEAM 1';
        const team2Name = team2NameInput.value.trim() || 'TEAM 2';
        gameData.teams[0].name = team1Name;
        gameData.teams[1].name = team2Name;

        team1NameDisplay.textContent = team1Name;
        team2NameDisplay.textContent = team2Name;
        team1NameModal.textContent = team1Name;
        team2NameModal.textContent = team2Name;

        switchScreen('game-board');
    });

    // --- Question Logic ---
    questionBoxes.forEach(box => {
        box.addEventListener('click', () => {
            if (box.classList.contains('answered')) {
                return;
            }

            const categoryIndex = box.dataset.category;
            const questionIndex = box.dataset.qIndex;
            const questionValue = parseInt(box.dataset.value);

            gameData.currentQuestionValue = questionValue;
            gameData.currentQuestionBox = box;

            questionText.textContent = gameData.questions[categoryIndex][questionIndex];
            questionModal.style.display = 'flex';
            questionModal.style.animation = 'pop-in 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        });
    });

    const closeModal = () => {
        questionModal.style.display = 'none';
        questionModal.style.animation = 'none';
    };

    const updateScore = (teamIndex, isCorrect) => {
        const value = gameData.currentQuestionValue;
        if (isCorrect) {
            gameData.teams[teamIndex].score += value;
        } else {
            gameData.teams[teamIndex].score -= value;
        }

        gameData.currentQuestionBox.classList.add('answered');
        gameData.answeredQuestions++;
        closeModal();

        // Add a new bouncing image if one is available
        if (imagesAdded < imagesToBounce.length) {
            const imgSrc = imagesToBounce[imagesAdded];
            const img = document.createElement('img');
            img.src = imgSrc;
            img.className = 'bouncing-image';
            bouncingContainer.appendChild(img);
            bounceImage(img);
            imagesAdded++;
        }

        if (gameData.answeredQuestions >= questionBoxes.length) {
            endGame();
        }
    };

    team1CorrectButton.addEventListener('click', () => updateScore(0, true));
    team1IncorrectButton.addEventListener('click', () => updateScore(0, false));
    team2CorrectButton.addEventListener('click', () => updateScore(1, true));
    team2IncorrectButton.addEventListener('click', () => updateScore(1, false));

    // --- Game End and Reset Logic ---
    const endGame = () => {
        const team1Score = gameData.teams[0].score;
        const team2Score = gameData.teams[1].score;

        if (team1Score > team2Score) {
            winnerText.textContent = `${gameData.teams[0].name} WINS!`;
        } else if (team2Score > team1Score) {
            winnerText.textContent = `${gameData.teams[1].name} WINS!`;
        } else {
            winnerText.textContent = "IT'S A TIE!";
        }

        finalScoreTeam1.textContent = `${gameData.teams[0].name}: $${team1Score}`;
        finalScoreTeam2.textContent = `${gameData.teams[1].name}: $${team2Score}`;

        // Move the bouncing images container to the final screen
        finalScreen.prepend(bouncingContainer);

        switchScreen('final-screen');
    };

    playAgainButton.addEventListener('click', () => {
        // Reset game state
        gameData.teams[0].score = 0;
        gameData.teams[1].score = 0;
        gameData.answeredQuestions = 0;
        imagesAdded = 0;

        // Clear all bouncing images
        bouncingContainer.innerHTML = '';

        // Reset question boxes
        questionBoxes.forEach(box => {
            box.classList.remove('answered');
        });

        // Move the bouncing images container back to the game board
        document.getElementById('game-board').prepend(bouncingContainer);

        switchScreen('main-menu');
    });

    // --- Bouncing Image Animation ---
    const bounceImage = (image) => {
        let x = Math.random() * (window.innerWidth - 100);
        let y = Math.random() * (window.innerHeight - 100);
        let dx = (Math.random() - 0.5) * 5;
        let dy = (Math.random() - 0.5) * 5;

        const animate = () => {
            x += dx;
            y += dy;

            if (x <= 0 || x >= window.innerWidth - 100) {
                dx *= -1;
                image.style.transform = `scaleX(${dx > 0 ? 1 : -1}) rotate(${Math.random() * 10 - 5}deg)`;
            }
            if (y <= 0 || y >= window.innerHeight - 100) {
                dy *= -1;
                image.style.transform = `scaleY(${dy > 0 ? 1 : -1}) rotate(${Math.random() * 10 - 5}deg)`;
            }

            image.style.left = `${x}px`;
            image.style.top = `${y}px`;

            requestAnimationFrame(animate);
        };
        animate();
    };

    const menuMusic = document.getElementById('menu-music');
    startButton.addEventListener('click', () => {
        if (menuMusic.paused) {
            menuMusic.play().catch(e => console.log('Music play failed:', e));
        }
    });
});