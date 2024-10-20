# Snake Game

This is a simple Snake game implemented using HTML, CSS, and JavaScript.

## How to Run the Application

1. Download or clone this repository to your local machine.

2. Navigate to the directory containing the game files.

3. Open the `index.html` file in a web browser. You can do this by:
   - Double-clicking the `index.html` file
   - Right-clicking the file and selecting "Open with" and then choosing your preferred web browser
   - Dragging and dropping the `index.html` file into an open browser window

4. The game should now load in your web browser.

## How to Play

1. Right-click anywhere on the screen to bring up the game controller.
2. You can drag the controller to a comfortable position.
3. Press the 'A' button on the controller (or the 'A' key on your keyboard) to start the game.
4. Use the D-pad on the controller (or arrow keys on your keyboard) to control the snake's direction.
5. Eat the red apples to grow longer and increase your score.
6. Avoid hitting the walls, obstacles, or yourself.
7. Press the 'B' button (or the 'B' key on your keyboard) to pause/resume the game.
8. Try to grow as long as possible without crashing!

## Overview

### Approach and Design Choices

1. **Context Menu as Game Controller**: The game uses a custom context menu as the game controller. This unique approach allows for a more interactive and visually appealing control scheme.

2. **Responsive Design**: The game is designed to be responsive and should work on various screen sizes, making it accessible on both desktop and mobile devices.

3. **Canvas-based Rendering**: The game uses HTML5 Canvas for rendering, which provides smooth graphics and efficient performance.

4. **Modular Code Structure**: The JavaScript code is organized into functions for different game elements (snake, food, obstacles) and game states (start, play, pause, game over), making it easier to maintain and extend.

5. **Accessibility Considerations**: Basic accessibility features are implemented, such as aria labels and keyboard support.

### Important Considerations

1. **Browser Compatibility**: The game relies on modern JavaScript features and HTML5 Canvas. It should work in all modern browsers but may not function correctly in very old browsers.

2. **Right-Click Behavior**: The game overrides the default right-click (context menu) behavior on most of the screen. Users should be aware that right-clicking is used to bring up the game controller.

3. **Performance**: On devices with limited processing power, the game's performance might be affected, especially as the snake grows longer.

4. **Mobile Usage**: While the game can be played on mobile devices, the experience is optimized for desktop use due to the nature of the controller interface.

5. **Future Enhancements**: Potential areas for improvement include adding sound effects, implementing difficulty levels, and creating a high score system.

## Additional Information

- Click on the "How to" button in the top-right corner of the game screen for more detailed instructions.
- The game is designed to be responsive and should work on various screen sizes.

Enjoy playing Snake!
