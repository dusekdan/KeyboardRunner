class ScreenManager {
    constructor() {
        log ("Screen manager created");

        this.mainMenuScreen = new MainMenuScreen();
        this.levelSelectScreen = new LevelSelectScreen();

        // TODO: Determine whether screen's should be manually created inside
        // ScreenManager constructor, or whether every screen should be created
        // automatically in the screen's constructor() function.
        this.mainMenuScreen.createScreen();
        
        this.levelSelectScreen.createScreen();
        this.levelSelectScreen.hideScreen();

        // Set reference for currently active screen
        this.activeScreen = this.mainMenuScreen;

    }

    switchToScreen(screenName) {
        log("ScreenManager: Switching to " + screenName);
        
        if (this.activeScreen != null) {
            this.activeScreen.hideScreen();
        }
        
        switch (screenName) {
            case "MainMenu":
                this.mainMenuScreen.showScreen();
                this.activeScreen = this.mainMenuScreen;
            break;
            case "LevelSelect":
                this.levelSelectScreen.showScreen();
                this.activeScreen = this.levelSelectScreen;
            break;
            default:
                alert("Requested screen is not available.");
            break;
        }
    }

    hideActiveScreen() {
        this.activeScreen.hideScreen();
        // TODO: If this creates problems for the running game screens, also
        // introduce z-index changes. There should be no need for function
        // showActiveScreen, the switchToScreen() function should be used
        // instead.
    }
}

class ScoreBoardScreen {
    constructor() {
        log("ScoreBoardScreen constructor called.");
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);
    }

    createScreen() {
        log("ScoreBoardScreen created."); 
    }

    // TODO: Introduced scoreboard table creation and retrieval.
    createScoreBoardTable() {

    }

    // Standardized methods for any screen
    showScreen() {
        log("ScoreBoardScreen: show");
        this.container.visible = true;
    }

    hideScreen() {
        log("ScoreBoardScreen: hide");
        this.container.visible = false;
    }
}

class MainMenuScreen {

    constructor() {
        log("MainMenuScreen constructor called");
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);
    }

    createScreen() {
        log("MainMenuScreen created");

        let buttons = this.createButtons();
        for (let i = 0; i < buttons.length; i++) {
            this.container.addChild(buttons[i]);
        }

        if (buttons.length == 4) {
            // PLAY button
            buttons[0].on('pointerdown', () => {
                log("Play clicked...");
                screenManager.hideActiveScreen();
                startGame();
            });

            // LEVEL SELECT button
            buttons[1].on('pointerdown', () => {
                screenManager.switchToScreen("LevelSelect");
            });

            // EXIT button redirects to danieldusek.com/projects
            buttons[3].on('pointerdown', () => {
                location.href = "https://danieldusek.com/projects";
            });
        }
    }

    // Screen specific methods (visual objects)
    createButtons() {
        const btnWidth = 500;
        const btnHeight = 75;
        const btnMargin = 50;

        var buttons = [];

        var texts = ["Play / Continue", "Level Select", "Score Board", "Exit"];
        
        // There are four buttons on MainMenu screen
        for (let i = 0; i < 4; i++) {
            let graphic = new PIXI.Graphics();
            let color = Utils.randomIntColor();
            
            graphic.beginFill(color);
            graphic.lineStyle(0);
            graphic.drawRect(0, 0, btnWidth, btnHeight);
            graphic.endFill();
            
            graphic.addChild(
                this.prepareButtonText(texts[i], "black")
            );
            
            var btn = Utils.createSpriteFromGraphics(app.renderer, graphic);
            btn.interactive = true;
            btn.buttonMode = true;
            
            // Position the buttons next to each other 
            btn.position.set(
                (app.renderer.width / 2) - (btnWidth / 2),
                btnMargin + (i * (btnHeight + btnMargin) )
            );

            buttons.push(btn);
        }

        return buttons;
    }

    prepareButtonText(text, color) {
        var text = new PIXI.Text(text, {
            fontFamily: "arial",
            fontSize: 24,
            fill: color
        });
        text.anchor.set(0.5, 0.5);
        text.position.set(250, 37.5);   // Center point of the button

        return text;
    }

    // Standardized methods for any screen
    // TODO: Consider creating parent class implementing these functions
    // so screens will inherit these methods.
    showScreen() {
        log("MainMenuScreen: show");
        this.container.visible = true;
    }

    hideScreen() {
        log("MainMenuScreen: hide");
        this.container.visible = false;
    }
}

const MAX_LEVELS_CAP = 16;
const LEVELS_PER_LINE = 4;
class LevelSelectScreen {
    constructor() {
        log("LevelSelectScreen: constructor called");
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);

        this.iconLenght = 80;
    }

    createScreen() {
        log("LevelSelectScreen: created");

        var LSG = new PIXI.Graphics();
        LSG.beginFill(Utils.randomIntColor());
        LSG.lineStyle(0);
        LSG.drawCircle(40, 40, 40);
        LSG.endFill();

        var LSButton = Utils.createSpriteFromGraphics(app.renderer, LSG);
        LSButton.buttonMode = true;
        LSButton.interactive = true;
        LSButton.position.set(
            (app.renderer.width / 2)  - 250,
            (app.renderer.height / 2) - 250 
        );
        LSButton.on('pointerdown', () => {
            log("LevelSelect screen button interaction.");
            screenManager.switchToScreen("MainMenu");
        });

        this.container.addChild(LSButton);

        // Add the remaining buttons
        let levels = this.createLevelSelectGrid();
        for (let i = 0; i < levels.length; i++) {
            log("adding children levels");
            this.container.addChild(levels[i]);
        }
    }

    // TODO: Introduce loading of the game state to display locked and unlocked 
    // levels.
    createLevelSelectGrid() {
        const levelIconMargin = 25;
        var yCorrection = 1;
        var xCorrection = 0;

        var levels = [];

        for (let i = 0; i < MAX_LEVELS_CAP; i++) {
            let levelGraphics = new PIXI.Graphics();
            levelGraphics.beginFill(Utils.randomIntColor());
            levelGraphics.lineStyle(0);

            if (i % 4 == 0 && i != 0) {
                yCorrection += 1;
            } 
            xCorrection = i % 4;

            let xOffset = levelIconMargin + xCorrection * (this.iconLenght + levelIconMargin);
            let yOffset = levelIconMargin + yCorrection * (this.iconLenght + levelIconMargin);

            let xHorizontalCorrection = (app.renderer.width / 2) - (2 * (this.iconLenght + levelIconMargin) )

            console.log("Level " + (i+1) + " has x:y (" + xOffset + "," + yOffset + ")");

            levelGraphics.drawRect(
                0, 0,
                this.iconLenght, this.iconLenght);
            levelGraphics.endFill();

            levelGraphics.addChild(
                this.prepareLevelButtonText((i+1), "black")
            );

            var level = Utils.createSpriteFromGraphics(app.renderer, levelGraphics);
            level.interactive = true;
            level.buttonMode = true;
            level.position.set(xOffset + xHorizontalCorrection, yOffset);

            level.on('pointerdown', () => {
                screenManager.hideActiveScreen();
                startGame((i+1));
                log("Should start level " + (i+1));
            });

            levels.push(level);
            
        }
        return levels;
    }

    prepareLevelButtonText(text, color) {
        var text = new PIXI.Text(text, {
            fontFamily: "arial",
            fontSize: 24,
            fill: color
        });

        let centerPoint = this.iconLenght / 2;

        text.anchor.set(0.5, 0.5);
        text.position.set(centerPoint, centerPoint);   // Center point of the button

        return text;
    }

    showScreen() {
        log("LevelSelectScreen: show");
        this.container.visible = true;
    }

    hideScreen() {
        log("LevelSelectScreen: hide");
        this.container.visible = false;
    }
}