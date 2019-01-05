const app = new PIXI.Application(1200, 600);
const log = console.log;

// Managers interacting with the game.
var cloudManager;
var wallManager;
var screenManager;
var FGManager;

// Layers of the (play) screen
var farBackground = new PIXI.Container();
var closeBackground = new PIXI.Container();
var foreground = new PIXI.Container();

const init = () => {
    log ("Game loaded.");
    
    if (document) {
        document.getElementById('the-play-screen').appendChild(app.view);
        app.renderer.backgroundColor = 0x757575;

        // Check whether GameStore with previous state exists
        if (!GameStore.checkStorageExist()) {
            GameStore.createFreshStorage();
        } else { log("GameStore from previous games exists."); }

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

const startGame = (level) => {
    
    // Put play-screen containers to the front. 
    farBackground.zIndex = 1;
    closeBackground.zIndex = 2;
    foreground.zIndex = 3;
    app.stage.addChild(farBackground);
    app.stage.addChild(closeBackground);
    app.stage.addChild(foreground);



    // Attach keyboard reader
    KeyboardReader.attachKeyboardReader();

    // Acquire word-set for current level
    let wordSet;
    if (GameStore.getLastUnlockedLevel() === 16) {
        wordSet = WordSet.getExtendedWordSetForLevel(level);
    } else {
        wordSet = WordSet.getWordSetForLevel(level);
    }
    
    
    // TODO: Determine what should happen depending on the level
    if (level === undefined) {
        log("Should obtain level to start from storage.");
    }
    log("Level " + level + " is starting.");

    // Instantiate necessary managers.
    cloudManager = new CloudManager(app, farBackground);
    wallManager = new WallManager(app, closeBackground);
    FGManager = new ForegroundManager(app, foreground, wordSet, level);   

    // Create player entity and put it into the game
    FGManager.addPlayerEntity();
    FGManager.addScoreIndicator();
    FGManager.addLifeIndicator();

    // Set up the basics for rendered canvas.
    app.renderer.backgroundColor = 0x22a7f0;
    app.renderer.render(app.stage);
    
    gameLoop();
    // Try ticker approach instead of gameLoop()
    //app.ticker.add(tickerCallback);
}

const gameLoop = () => {
    let gameTickResult = FGManager.runTick();
    if (gameTickResult !== "LEVEL-FINISHED-FLAG-TERMINATED") {
        wallManager.runTick();
        cloudManager.runTick();
        requestAnimationFrame(gameLoop);
    } else {
        // Destroy and reset objects created for the gameloop
        KeyboardReader.dettachKeyboardReader();
        cloudManager.destructor();
        wallManager.destructor();
        FGManager.destructor();
        screenManager.switchToScreen("MainMenu");
    }
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