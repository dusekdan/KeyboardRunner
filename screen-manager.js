class ScreenManager {
    constructor() {
        log ("Screen manager created");

        this.mainMenuScreen = new MainMenuScreen();
        this.levelSelectScreen = new LevelSelectScreen();
        this.scoreBoardScreen = new ScoreBoardScreen();

        // TODO: Determine whether screen's should be manually created inside
        // ScreenManager constructor, or whether every screen should be created
        // automatically in the screen's constructor() function.
        this.mainMenuScreen.createScreen();
        
        this.levelSelectScreen.createScreen();
        this.levelSelectScreen.hideScreen();

        //this.scoreBoardScreen.createScreen();
        //this.scoreBoardScreen.hideScreen();

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
                
                // Reset background color. (ugly hack)
                app.renderer.backgroundColor = 0x757575;
            break;
            case "LevelSelect":
                this.levelSelectScreen.showScreen();
                this.activeScreen = this.levelSelectScreen;
            break;
            case "ScoreBoard":
                this.scoreBoardScreen.showScreen();
                this.activeScreen = this.scoreBoardScreen;
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

        // Put stickman to menu
        this.createMenuStickMan();

        if (buttons.length == 4) {
            // PLAY button
            buttons[0].on('pointerdown', () => {
                screenManager.hideActiveScreen();
                startGame(
                    GameStore.getLastUnlockedLevel()
                ); // TODO: Load this from local storage.
            });

            // LEVEL SELECT button
            buttons[1].on('pointerdown', () => {
                screenManager.switchToScreen("LevelSelect");
            });

            // SCORE BOARD button)
            buttons[2].on('pointerdown', () => {
                screenManager.switchToScreen("ScoreBoard");
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
        const btnHeight = 70;
        const btnMargin = 50;
        const btnBaseMarginTop = 75;

        var buttons = [];
        var buttonNames = ["PlayButton", "LevelSelectButton", "HighScoreButton", "ExitButton"];

        app.stage.interactive = true;
        for (let i = 0; i < buttonNames.length; i++) {
            let button = this.prepareButtonSprite(buttonNames[i]);
            button.interactive = true;
            button.buttonMode = true;

            // Set up changing texture for hover (and pointing stickman)
            button.mouseover = data =>  {
                button.gotoAndStop(1);
                this.updateMenuStickManTarget(i);
            }
            button.mouseout  = data =>  { 
                button.gotoAndStop(0);
            }
            button.position.set(
                (app.renderer.width / 2) - (btnWidth / 2),
                btnBaseMarginTop + (i * (btnHeight + btnMargin))
            );
            buttons.push(button);
        }

        return buttons;
    }

    createMenuStickMan() {
        let stickman = new PIXI.MovieClip([
            PIXI.loader.resources[menuFolder + "stickman_1.png"].texture,
            PIXI.loader.resources[menuFolder + "stickman_2.png"].texture,
            PIXI.loader.resources[menuFolder + "stickman_3.png"].texture,
            PIXI.loader.resources[menuFolder + "stickman_4.png"].texture,
        ]);
        stickman.position.set(35,35);
        this.menuStickMan = stickman;
        this.container.addChild(this.menuStickMan);
    }

    updateMenuStickManTarget(targetNumber) {
        if (targetNumber < 4 && targetNumber >= 0) {
            this.menuStickMan.gotoAndStop(targetNumber);
        } else {log("ERR: Stickman can not really point there. Sorry.");}
    }

    prepareButtonSprite(buttonName) {
        /*let sprite = new PIXI.Sprite(
            PIXI.loader.resources[menuFolder + buttonName + ".png"].texture
        );*/

        let sprite = new PIXI.MovieClip([
            PIXI.loader.resources[menuFolder + buttonName + ".png"].texture, 
            PIXI.loader.resources[menuFolder + buttonName + "_hover.png"].texture
        ]);
        
        return sprite;
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

const SCORE_RECT_LENGTH = 800;
const SCORE_RECT_HEIGHT = 35; 
const SCORE_RECTS_TOP_OFFSET_BASE = 100;
const SCORE_RECT_MARGIN = 15;
class ScoreBoardScreen {
    constructor() {
        log("ScoreBoardScreen constructor called.");
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);
    }

    destructor() {
        while (this.container.children.length != 0) {
            this.container.children[0].destroy();
        }
    }

    createScreen() {
        log("ScoreBoardScreen created."); 
        
        this.createBackButton();

        this.createScoreBoardTable();
    }

    createBackButton() {
        var S = new PIXI.Sprite(
            PIXI.loader.resources[levelFolder + "backbutton.png"].texture
        );
        S.interactive = true;
        S.buttonMode = true;

        S.on('pointerdown', () => {
            screenManager.switchToScreen("MainMenu");
        })

        S.position.set(25, 25);
        this.container.addChild(S);

    }

    createScoreBoardTable() {
        const ScoreRowTextStyle = { "fontFamily": "Arial Black", "fontSize": 18 };

        // Obtain data for high score table rows
        var highScoreRows = GameStore.getTopNScores(10);

        for (let i = 0; i < highScoreRows.length; i++) {
            var row = new PIXI.Graphics();
            row.beginFill(0xd1c4e9, 0.5);
            row.lineStyle(0);
            row.drawRect(0,0, SCORE_RECT_LENGTH, SCORE_RECT_HEIGHT);
            row.endFill();

            var rowText = new PIXI.Text("#" + (i+1) + ": " + highScoreRows[i].score + " (" + highScoreRows[i].name + ")", ScoreRowTextStyle);
            rowText.anchor.set(0, 0.5)
            rowText.position.set(15, SCORE_RECT_HEIGHT/2);
            row.addChild(rowText);

            // Position row to the correct part of the screen
            row.position.set(
                (app.renderer.width/2) - (SCORE_RECT_LENGTH/2),
                (SCORE_RECTS_TOP_OFFSET_BASE) + i * (SCORE_RECT_MARGIN + SCORE_RECT_HEIGHT)
            );

            this.container.addChild(row);
        }


    }

    // Standardized methods for any screen
    showScreen() {
        log("ScoreBoardScreen: show");
        this.createScreen();
        this.container.visible = true;
    }

    hideScreen() {
        log("ScoreBoardScreen: hide");
        this.destructor();
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

    destructor() {
        while (this.container.children.length != 0) {
            this.container.children[0].destroy();
        }
    }

    createScreen() {
        log("LevelSelectScreen: created");

        this.createBackButton();

        // Add the remaining buttons
        let levels = this.createLevelSelectGrid();
        for (let i = 0; i < levels.length; i++) {
            this.container.addChild(levels[i]);
        }
    }

    createBackButton() {
        var S = new PIXI.Sprite(
            PIXI.loader.resources[levelFolder + "backbutton.png"].texture
        );
        S.interactive = true;
        S.buttonMode = true;

        S.on('pointerdown', () => {
            screenManager.switchToScreen("MainMenu");
        })

        S.position.set(25, 25);
        this.container.addChild(S);

    }

    createLevelSelectGrid() {
        const levelIconMargin = 25;
        var yCorrection = 1;
        var xCorrection = 0;

        var levels = [];

        let levelBGC =  0x2174a8;

        let levelNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", 
        "10", "11", "12", "13", "14", "15", "16"];

        for (let i = 0; i < MAX_LEVELS_CAP; i++) {
            if (i % 4 == 0 && i != 0) {
                yCorrection += 1;
            } 
            xCorrection = i % 4;

            let xOffset = levelIconMargin + xCorrection * (this.iconLenght + levelIconMargin);
            let yOffset = levelIconMargin + yCorrection * (this.iconLenght + levelIconMargin);

            let xHorizontalCorrection = (app.renderer.width / 2) - (2 * (this.iconLenght + levelIconMargin) )

            var level = new PIXI.Sprite(
                PIXI.loader.resources[levelFolder + levelNames[i] + ".png"].texture
            );
            level.position.set(xOffset + xHorizontalCorrection, yOffset);

            // Give a grey tint & padlock icon to the locked levels
            if ((i+1) > GameStore.getLastUnlockedLevel()) {
                level.tint = 0x636568;

                // Icon
                var padlock = new PIXI.Sprite(
                    PIXI.loader.resources["assets/images/lock-50.png"].texture
                );
                padlock.anchor.set(0.5, 0.5);
                padlock.position.set(this.iconLenght/2, this.iconLenght/2);
                level.addChild(padlock);
            }            

            // Allow clicking only on the unlocked levels
            if ((i+1) <= GameStore.getLastUnlockedLevel()) {
                level.interactive = true;
                level.buttonMode = true;

                level.on('pointerdown', () => {
                    screenManager.hideActiveScreen();
                    startGame((i+1));
                    log("Should start level " + (i+1));
                });
            }


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
        this.createScreen();
        this.container.visible = true;
    }

    hideScreen() {
        log("LevelSelectScreen: hide");
        this.destructor();
        this.container.visible = false;
    }
}