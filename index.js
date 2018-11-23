const app = new PIXI.Application(1200, 600);
const log = console.log;

// Managers interacting with the game.
var cloudManager;

const init = () => {
    
    log ("Resources successfully loaded. Starting the game.");
    
    // Check that document object model exists before trying to alter it.
    if (document) {
        document.getElementById('the-play-screen').appendChild(app.view);
    } else {
        log ("Error: The Document Object Model does not exist. It was not possible to create player view.");
    }
    
    // Instantiate necessary managers.
    cloudManager = new CloudManager(app);
    
    // Set up the basics for rendered canvas.
    app.renderer.backgroundColor = 0x22a7f0;
    app.renderer.render(app.stage);
    gameLoop();
}

const gameLoop = () => {
    requestAnimationFrame(gameLoop);
    log ("Game loop called.");
    cloudManager.update();
};


// Assets loading call has to be executed after the init function is defined.
loadPIXIResources(init);