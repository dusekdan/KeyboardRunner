const app = new PIXI.Application(1200, 600);
const log = console.log;

// Layers of the (play) screen
const farBackground = new PIXI.Container();
const closeBackground = new PIXI.Container();


// Managers interacting with the game.
var cloudManager;
var wallManager;
var screenManager;

const init = () => {
    log ("Game loaded.");
    
    if (document) {
        document.getElementById('the-play-screen').appendChild(app.view);
    } else {
        log ("Error: DOM does not exist, unable to load the game.");
        alert("It was not possible to load the game.");
    }

    // Instantiating screen manager prepares all the screens and puts the 
    // mainscreen into the foreground. Instantiation must be done within
    // start function, which is called AFTER all the game resources are
    // loaded. This way availability of textures/sprites/globals is ensured.
    screenManager = new ScreenManager();
}

const startGame = () => {
    
    // Instantiate necessary managers.
    cloudManager = new CloudManager(app, farBackground);
    wallManager = new WallManager(app, closeBackground);

    // Configure background layers and add them to the stage.
    farBackground.zIndex = 1;
    closeBackground.zIndex = 2;
    app.stage.addChild(farBackground);
    app.stage.addChild(closeBackground);

    // Set up the basics for rendered canvas.
    app.renderer.backgroundColor = 0x22a7f0;
    app.renderer.render(app.stage);
    
    gameLoop();
    // Try ticker approach instead of gameLoop()
    //app.ticker.add(tickerCallback);
}

const gameLoop = () => {
    requestAnimationFrame(gameLoop);
    cloudManager.runTick();
    wallManager.runTick();
};

const tickerCallback = deltaTime => {
    requestAnimationFrame();
    cloudManager.runTick(deltaTime);
    log("Ticker callback called.");
};


//var ticker = new PIXI.ticker.Ticker();
//app.ticker.add(() => {log("Ticker: " + ticker.deltaTime);});

// Assets loading call has to be executed after the init function is defined.
loadPIXIResources(init);