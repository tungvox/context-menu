document.addEventListener('DOMContentLoaded', () => {
    const gameScreen = document.getElementById('game-screen');
    const controller = document.querySelector('.controller');
    const handle = document.querySelector('.controller-handle');

    // Initialize the Snake game
    initSnakeGame();

    // Draggable controller
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    let lastMouseUp = 0;

    handle.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseInt(window.getComputedStyle(controller).left);
        startTop = parseInt(window.getComputedStyle(controller).top);
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;
        
        // Get the dimensions of the controller and the viewport
        const controllerRect = controller.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Constrain horizontal movement
        newLeft = Math.max(0, Math.min(newLeft, viewportWidth - controllerRect.width));
        
        // Constrain vertical movement
        newTop = Math.max(0, Math.min(newTop, viewportHeight - controllerRect.height));
        
        controller.style.left = `${newLeft}px`;
        controller.style.top = `${newTop}px`;
    }

    function stopDragging(e) {
        if (isDragging) {
            isDragging = false;
            lastMouseUp = Date.now();
            e.preventDefault();
            e.stopPropagation();
        }
    }

    // Prevent default context menu and show our custom controller
    document.addEventListener('contextmenu', (e) => {
        // Check if the right-click occurred on a game card or the controller
        if (!e.target.closest('.game-card') && !e.target.closest('.controller')) {
            e.preventDefault();
            const contextMenu = document.querySelector('.controller');
            const fakeController = document.querySelector('.fake-controller');
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Initially position the menu at the mouse location
            contextMenu.style.left = `${mouseX}px`;
            contextMenu.style.top = `${mouseY}px`;

            // Make the menu visible and hide the fake controller
            contextMenu.classList.add('visible');
            fakeController.style.display = 'none';

            // After the menu is visible, adjust its position if necessary
            setTimeout(() => {
                const controllerRect = contextMenu.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                // Adjust position if menu overflows off the right or bottom of the screen
                const margin = 10;
                let adjustedX = Math.min(mouseX, viewportWidth - controllerRect.width - margin);
                let adjustedY = Math.min(mouseY, viewportHeight - controllerRect.height - margin);

                adjustedX = Math.max(margin, adjustedX);
                adjustedY = Math.max(margin, adjustedY);

                contextMenu.style.left = `${adjustedX}px`;
                contextMenu.style.top = `${adjustedY}px`;
            }, 0);
        }
        // If right-click is on a game card or the controller, the default context menu will appear
    });

    document.addEventListener('click', (event) => {
        const contextMenu = document.querySelector('.controller');
        const fakeController = document.querySelector('.fake-controller');
        
        // Check if this click is not the end of a drag operation
        if (Date.now() - lastMouseUp > 50) {
            // Only update position if the real controller is visible
            // and the click is outside the controller
            if (event.button === 0 && 
                contextMenu.classList.contains('visible') && 
                !contextMenu.contains(event.target)) {
                updateFakeControllerPosition(contextMenu, fakeController);
                contextMenu.classList.remove('visible');
                fakeController.style.display = 'block';
            }
        }
    });

    document.addEventListener('keydown', (event) => {
        const contextMenu = document.querySelector('.controller');
        const fakeController = document.querySelector('.fake-controller');
        if (event.key === 'Escape' && contextMenu.classList.contains('visible')) {
            updateFakeControllerPosition(contextMenu, fakeController);
            contextMenu.classList.remove('visible');
            fakeController.style.display = 'block';
        }
    });

    const instructionPaper = document.querySelector('.instruction-paper');
    const popup = document.getElementById('instruction-popup');
    const closePopup = document.getElementById('close-popup');

    instructionPaper.addEventListener('click', () => {
        popup.style.display = 'block';
    });

    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // Close the popup if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});

// Controller button functions
function up() { 
    console.log('Up button pressed');
    if (window.up) window.up();
}
function down() { 
    console.log('Down button pressed');
    if (window.down) window.down();
}
function left() { 
    console.log('Left button pressed');
    if (window.left) window.left();
}
function right() { 
    console.log('Right button pressed');
    if (window.right) window.right();
}

function buttonA() { 
    console.log('A button pressed');
    if (startGame) {
        startGame();
    }
}
function buttonB() { 
    console.log('B button pressed');
    if (togglePause) {
        togglePause();
    }
}
function buttonX() { console.log('X button pressed'); }
function buttonY() { console.log('Y button pressed'); }

function updateFakeControllerPosition(realController, fakeController) {
    const rect = realController.getBoundingClientRect();
    fakeController.style.left = `${rect.left}px`;
    fakeController.style.top = `${rect.top}px`;
}

const initSnakeGame = () => {
    console.log('Snake game initialized');
    const gameScreen = document.getElementById('game-screen');
    const tvScreen = document.querySelector('.tv-screen');
    const canvas = gameScreen;
    const ctx = canvas.getContext('2d');

    // Set canvas size to match tv-screen
    canvas.width = tvScreen.clientWidth;
    canvas.height = tvScreen.clientHeight;

    const gridSize = 20;
    let snake = [{ x: 5, y: 5 }];
    let food = null;
    let direction = 'right';
    let gameLoopInterval;
    let isPaused = false;
    let obstacles = [];  // Array to hold obstacle positions

    let lastUpdateTime = 0;
    const updateInterval = 200; // milliseconds
    let accumulator = 0;
    let interpolation = 0;

    let score = 0;  // Add this line to keep track of the score

    let isGameStarted = false;

    function createStartScreen() {
        const startScreen = document.createElement('div');
        startScreen.className = 'start-screen';
        startScreen.innerHTML = `
            <h1>Snake Game</h1>
            <div class="snake-icon">🐍</div>
            <div class="instructions">Use the D-pad to move<br>Eat the apples to grow</div>
            <div class="press-a">Press 'A' to Start</div>
        `;
        tvScreen.appendChild(startScreen);
        return startScreen;
    }

    const startScreen = createStartScreen();

    function removeStartScreen() {
        startScreen.remove();
    }

    function getRandomFood() {
        const gridWidth = Math.floor(canvas.width / gridSize);
        const gridHeight = Math.floor(canvas.height / gridSize);
        
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * gridWidth),
                y: Math.floor(Math.random() * gridHeight)
            };
        } while (isPositionOccupied(newFood));

        return newFood;
    }

    function isPositionOccupied(position) {
        // Check if the position is occupied by the snake
        for (let segment of snake) {
            if (segment.x === position.x && segment.y === position.y) {
                return true;
            }
        }
        
        // Check if the position is occupied by an obstacle
        for (let obstacle of obstacles) {
            if (obstacle.x === position.x && obstacle.y === position.y) {
                return true;
            }
        }
        
        return false;
    }

    function generateObstacles() {
        const numObstacles = 5;  // You can adjust this number
        obstacles = [];
        for (let i = 0; i < numObstacles; i++) {
            let obstacle;
            do {
                obstacle = {
                    x: Math.floor(Math.random() * (canvas.width / gridSize)),
                    y: Math.floor(Math.random() * (canvas.height / gridSize))
                };
            } while (isPositionOccupied(obstacle));
            obstacles.push(obstacle);
        }
    }

    function drawObstacles() {
        ctx.fillStyle = 'gray';
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize, gridSize);
        });
    }

    function drawSnake() {
        snake.forEach((segment, index) => {
            const centerX = (segment.x * gridSize) + (gridSize / 2);
            const centerY = (segment.y * gridSize) + (gridSize / 2);
            const radius = gridSize / 2; // Full radius to touch adjacent segments

            // Draw a full circle for each segment
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fill();

            // If it's not the last segment, draw a rectangle to connect to the next segment
            if (index < snake.length - 1) {
                const nextSegment = snake[index + 1];
                const nextCenterX = (nextSegment.x * gridSize) + (gridSize / 2);
                const nextCenterY = (nextSegment.y * gridSize) + (gridSize / 2);

                ctx.beginPath();
                ctx.strokeStyle = 'green';
                ctx.lineWidth = gridSize;
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(nextCenterX, nextCenterY);
                ctx.stroke();
            }
            
            // Draw eyes on the head
            if (index === 0) {
                ctx.fillStyle = 'white';
                const eyeRadius = gridSize / 10;
                const eyeOffsetX = gridSize / 4;
                const eyeOffsetY = gridSize / 5;
                
                // Left eye
                ctx.beginPath();
                ctx.arc(centerX - eyeOffsetX, centerY - eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
                ctx.fill();
                
                // Right eye
                ctx.beginPath();
                ctx.arc(centerX + eyeOffsetX, centerY - eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
    }

    function drawFood() {
        if (food) {
            const centerX = (food.x * gridSize) + (gridSize / 2);
            const centerY = (food.y * gridSize) + (gridSize / 2);
            const radius = (gridSize / 2) - 2;

            // Apple body
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();

            // Apple highlight
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.arc(centerX - radius / 3, centerY - radius / 3, radius / 2, 0, Math.PI * 2);
            ctx.fill();

            // Stem
            ctx.beginPath();
            ctx.strokeStyle = 'brown';
            ctx.lineWidth = 2;
            ctx.moveTo(centerX, centerY - radius);
            ctx.quadraticCurveTo(centerX + radius / 2, centerY - radius - 5, centerX + radius / 2, centerY - radius);
            ctx.stroke();

            // Leaf
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.moveTo(centerX + radius / 2, centerY - radius);
            ctx.quadraticCurveTo(centerX + radius, centerY - radius - 5, centerX + radius / 2, centerY - radius - 10);
            ctx.quadraticCurveTo(centerX + radius / 4, centerY - radius - 5, centerX + radius / 2, centerY - radius);
            ctx.fill();
        }
    }

    function moveSnake() {
        const head = { ...snake[0] };

        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        snake.unshift(head);

        if (food && head.x === food.x && head.y === food.y) {
            food = getRandomFood();
            score++;  // Increment score when food is eaten
        } else {
            snake.pop();
        }
    }

    function showGameOverScreen() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 50);

        ctx.font = '24px Arial, sans-serif';
        ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height / 2);

        ctx.font = '18px Arial, sans-serif';
        ctx.fillText('Press "A" to play again', canvas.width / 2, canvas.height / 2 + 50);

        // Add aria-live region for screen readers
        const gameOverAnnouncement = document.getElementById('game-over-announcement');
        if (!gameOverAnnouncement) {
            const announcement = document.createElement('div');
            announcement.id = 'game-over-announcement';
            announcement.setAttribute('aria-live', 'assertive');
            announcement.style.position = 'absolute';
            announcement.style.left = '-9999px';
            document.body.appendChild(announcement);
        }
        gameOverAnnouncement.textContent = `Game Over! Your score is ${score}. Press A to play again.`;

        isGameStarted = false;
        setTimeout(() => {
            tvScreen.appendChild(startScreen);
        }, 2000);
    }

    function gameLoop() {
        if (!isPaused) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Check collision before moving
            if (willCollide()) {
                showGameOverScreen();
                clearInterval(gameLoopInterval);
                gameLoopInterval = null;
                return;
            }
            
            moveSnake();
            drawObstacles();
            drawSnake();
            drawFood();

            // Display score
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`Score: ${score}`, 10, 30);
        }
    }

    function willCollide() {
        const head = { ...snake[0] };
        
        // Predict next position
        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // Check if next position is out of bounds
        if (head.x < 0 || head.x >= canvas.width / gridSize ||
            head.y < 0 || head.y >= canvas.height / gridSize) {
            return true;
        }
        
        // Check collision with self
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        
        // Check collision with obstacles
        if (obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
            return true;
        }
        
        return false;
    }

    startGame = () => {
        if (!isGameStarted) {
            isGameStarted = true;
            removeStartScreen();
            resetGame();
            food = getRandomFood();
            generateObstacles();
            gameLoopInterval = setInterval(gameLoop, 200);
        }
    };

    function resetGame() {
        clearInterval(gameLoopInterval);
        gameLoopInterval = null;
        snake = [{ x: 5, y: 5 }];
        food = null;
        direction = 'right';
        isPaused = false;
        obstacles = [];
        score = 0;
        isGameStarted = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
    }

    togglePause = () => {
        if (gameLoopInterval) {
            isPaused = !isPaused;
            if (isPaused) {
                console.log('Game paused');
            } else {
                console.log('Game resumed');
            }
        }
    };

    // Initial draw
    drawSnake();

    // Update controller functions
    window.up = () => { if (direction !== 'down') direction = 'up'; };
    window.down = () => { if (direction !== 'up') direction = 'down'; };
    window.left = () => { if (direction !== 'right') direction = 'left'; };
    window.right = () => { if (direction !== 'left') direction = 'right'; };
}

// Add keyboard support for game controls
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            up();
            break;
        case 'ArrowDown':
            down();
            break;
        case 'ArrowLeft':
            left();
            break;
        case 'ArrowRight':
            right();
            break;
        case 'a':
        case 'A':
            buttonA();
            break;
        case 'b':
        case 'B':
            buttonB();
            break;
        // Add cases for X and Y buttons if needed
    }
});
