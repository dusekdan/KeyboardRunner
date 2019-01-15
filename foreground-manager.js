const ScoreTextStyle = { "letterSpacing": 2, "fontFamily" : "Arial Black", "fill": "#000","fontSize": 20,"fontVariant": "small-caps"};
const INITIAL_LIFES = 3;
const MAX_LIFES = 20;

class ForegroundManager {
    constructor(app, container, wordSet, level) {
        log("Foreground manager created");
        
        // Render object references
        this.container = container;
        this.entityViews = [];

        // Basic game launch settings
        this.score = 0;
        this.level = level;
        this.wordList = wordSet;
        this.lifes = INITIAL_LIFES;
        this.currentTarget = null;

        // Environment settings
        this.entityLimit = 10;
        this.entitySize = 25;
        this.shouldTerminateThisTick = false;
        
        // The initial number of ticks before the first entity gets spawned.
        this.ticks = 100;
    }

    destructor() {
        this.player.destroy();
        
        while(this.container.children.length != 0) {
            this.container.children[0].destroy();
        }

        while(this.entityViews.length != 0) {
            this.destroyEntity(this.entityViews[0]);
        }
    }

    calculateScore(age, length) {
        // FUTURE: Introduce game speed into equation
        const pointsPerLetter = 10;
        const ticksPerSecond = 60;
        const penaltyPerSecond = 10;
        let scoreBase = length * pointsPerLetter;
        let ageInSeconds = age / ticksPerSecond;
        let penalty = 0;
        if (ageInSeconds > 3.5) {
            penalty = ageInSeconds * penaltyPerSecond;
        }

        let finalScore = Math.floor(scoreBase - penalty);
        
        // Correction so it is not possible to obtain negative score
        if (finalScore < 10 ) {
            finalScore = 10;
        }

        if (
            Utils.detectScoreOverTreshold(1000, this.score, this.score + finalScore) &&
            this.lifes < MAX_LIFES
        ) {
            this.updateLifeIndicator(false);
        }

        this.score += finalScore;
        return this.score;
    }

    addPlayerEntity() {
        var player = new PIXI.Sprite(
            PIXI.loader.resources[imagesFolder + "stickmanUFO.png"].texture
        );
        player.position.set(35,  400);
        this.container.addChild(player);

        this.player = player;
        this.shouldMoveForward = true;
    }

    addScoreIndicator() {
        var scoreText = new PIXI.Text("Score: " + 0, ScoreTextStyle);
        scoreText.name = "ScoreIndicator";
        scoreText.position.set(
            app.renderer.width - 300,
            25
        );
        this.container.addChild(scoreText);
    }

    addLifeIndicator() {
        var healthIndicators = [];

        for (let i = 0; i < MAX_LIFES; i++) {
            var sprite = new PIXI.Sprite(
                PIXI.loader.resources["assets/images/heart-icon.png"].texture
            );

            let xOffset =  i * (32 + 2);

            sprite.position.set(
                35 + xOffset,
                35
            );

            sprite.visible = false;

            this.container.addChild(sprite);
            healthIndicators.push(sprite);
            this.healthIndicators = healthIndicators;
        }

        for (let i = 0; i < INITIAL_LIFES; i++) {
            healthIndicators[i].visible = true;
        }
    }

    updateLifeIndicator(shouldDecrement = true) {
        if (shouldDecrement) {
            this.lifes -= 1;
            this.healthIndicators[this.lifes].visible = false;
        } else {
            this.healthIndicators[this.lifes].visible = true;
            this.lifes += 1;
        }
    }

    updateScoreIndicator(value) {
        let scoreIndicator = this.container.getChildByName("ScoreIndicator");
        log(scoreIndicator);
        if (scoreIndicator !== undefined) {
            scoreIndicator.text = "Score: " + value;
            scoreIndicator.style = ScoreTextStyle;
        }
    }

    createEntity(word, isEnemy) {
        // Game operates with event.keyCode which is always uppercase (the KEY)
        let normalizedWord = word.toUpperCase();

        // Entity view has reference to Entity object and is already responsible
        // for drawing the entity into this.container.
        var entityView = new EntityView(
            new Entity(normalizedWord, isEnemy),
            this.container, this.getBestHeightForEntitySpawn()
        );
        entityView.setEntityMovementSpeedMultiplier(
            Utils.getSpeedMultiplierForLevel(this.level)
        );
        this.entityViews.push(entityView);
    }

    destroyEntity(entity) {
        log("Destroying entity.");

        // Check whether entity has been targeted, if yes, reset currentTarget
        if (entity.model.wordProgress !== "") {
            this.currentTarget = null;
        }

        let toDelete;
        for(let i = 0; i < this.entityViews.length; i++) {
            if (this.entityViews[i].model.word === entity.model.word) {
                toDelete = i;
            }
        }
        this.entityViews.splice(toDelete, 1);
        log(this.entityViews);
        log("Destroyed objects from entityViews.");

        // Entity destroys itself and removes anything visual from the stage.
        entity.destroyEntity();
    }

    keypressNotify(keyCode) {
        // Check if the pressed key has some consequences
        let letter = String.fromCharCode(keyCode);
        log("Key " + keyCode  + " pressed. Read as '" + letter + "' char.");
        
        // Search for suitable target
        if (this.currentTarget === null) {
            let candidates = [];
            this.entityViews.forEach((element, index, array) => {
                if (element.model.getRemaining().startsWith(letter)) {
                    candidates.push(element);
                }
            });

            // FUTURE: Pick target closer to the player (atm: the first)
            if (candidates.length > 0) {
                log("Candidate would be: " + candidates[0].model.word);
                this.currentTarget = candidates[0];
                this.currentTarget.updateEntityDestruction(letter);
            } else {
                log("No suitable candidates found. This would be a miss");
            }

        } else {
            // Check if the pressed key is the key expected in currentTarget
            if (this.currentTarget.model.getRemaining().startsWith(letter)) {
                this.currentTarget.updateEntityDestruction(letter);
            } else {
                log("Current target does not start with this letter. That would be miss.");
            }
        }
    }

    runTick() {
        // Update all the entities as necessary.
        let updateJump = 2;
        if (this.player.position.x < 150 && this.shouldMoveForward){
            this.player.position.x += updateJump;
        } else {
            this.shouldMoveForward = false;
        }

        if (this.player.position.x > 0 && this.shouldMoveForward === false) {
            this.player.position.x -= updateJump;
        }
        else {
            this.shouldMoveForward = true;
        }

        // Spawn entities every once in a while
        if (this.ticks > 0)
            this.ticks -= 1;
        
        if (
            this.ticks == 0 && 
            this.entityViews.length < this.entityLimit &&
            this.wordList.length != 0   // No words available, game ending condition should trigger soon. FUTURE: Ensure game ending condition is triggered synchronously (maybe check in entity destruction; then this part of the condition will not be necessary)
            ) {
            
            let wordToSpawn = this.wordList.pop();
            
            this.createEntity(wordToSpawn, true);
            
            this.ticks = Math.floor(Utils.randomNumberFromRange(36, 360));
            log("Spawned entity. Scheduling next entity to: " + this.ticks + " ticks. Total: " + this.entityViews.length);
        }

        // Make existing entities move
        this.entityViews.forEach((element, index, array) => {
            element.updateEntityMovement();
        });

        // Calculate score here & then destroy entity for good.
        if (this.currentTarget !== null && this.currentTarget.isEntityDestroyed()) {
            
            let score = this.calculateScore(
                this.currentTarget.model.age, 
                this.currentTarget.model.word.length
            );
            log("Calculated score: " + score);
            this.updateScoreIndicator(score);

            this.destroyEntity(this.currentTarget);

            this.currentTarget = null;

        }

        // Check game ending condition
        let hasPlayerLost = this.hasPlayerLost();
        if (this.isLevelBeaten() || hasPlayerLost) {
            if (this.shouldTerminateThisTick) {
                // Try to get the player name for the scoreboard & save score.
                let promptText = hasPlayerLost ? "DAMN, YOU LOSE!\n" : "God damn! Looks like we've got ourselves a winner!\n"
                let playerName = prompt(promptText + "\nPlease enter your name:"); // FUTURE: Replace this with in-game rendered pop-up. (BIG)
                GameStore.saveScore(this.level, this.score, playerName);

                if (!hasPlayerLost) {
                    // If the next level after this one was not beaten before, unlock it.
                    let lastUnlockedLevel = parseInt(GameStore.getLastUnlockedLevel());
                    if (lastUnlockedLevel == this.level) {
                        log("trying to unlock " + this.level);
                        GameStore.setLevelCompleted(this.level);
                    }
                }

                return "LEVEL-FINISHED-FLAG-TERMINATED";
            } 

            this.shouldTerminateThisTick = true;
            return "LEVEL-IN-PROGRESS";
        } else {
            return "LEVEL-IN-PROGRESS";
        }
    }

    deprecated_getBestHeightForEntitySpawn() {
        let maxDistance = 0;
        let pointA, pointB;
        
        // Calculate the best height starting at 2+ existing entities.
        if (this.entityViews.length > 1) {
            for (i = 0; i < this.entityViews.length; i++) {
                if (i === this.entityViews.length-1) {
                    // Break on last item (has no neighbor)
                }
                let point = this.entityViews[i].container.position.y;
                let neighbor = this.entityViews[i+1].container.position.y;
                let distance = Math.abs(point-neighbor);
                if (distance > maxDistance) {
                    maxDistance = distance;
                    pointA = point;
                    pointB = neighbor;
                }
            }

            return (pointA + maxDistance/2);
        } else {
            if (this.entityViews.length === 1) {
                // Return center point between the greater range
                let point = this.entityViews[0].container.position.y;
                let distanceToTop = 525 - point;
                let distanceToBottom = point - 250;

                return distanceToTop > distanceToBottom ? (distanceToTop/2) + point : point - (distanceToBottom/2);

            } else {
                // Return something completely random within range.
                return Utils.randomNumberFromRange(250, 525);
            }
        }
    }

    getBestHeightForEntitySpawn() {
        let allPoints = [250, 525];
        let maxDistance = 0;
        let originPoint;

        if (this.entityViews.length === 0) {
            return Utils.randomNumberFromRange(250, 525);
        } else {
            this.entityViews.forEach(element => {
                allPoints.push(element.container.position.y);
            });
            allPoints.sort();

            for(let i = 0; i < allPoints.length; i++) {
                if (i === allPoints.length-1) { break; }    // Has no neighbor.

                let point = allPoints[i];
                let neighbor = allPoints[i+1];
                
                let distance = Math.abs(point-neighbor);
                if (distance > maxDistance) {
                    maxDistance = distance;
                    originPoint = point;
                }
            }

            return Math.floor(originPoint + (maxDistance/2));
        }
    }

    isLevelBeaten() {
        return this.wordList.length == 0 && this.entityViews.length == 0;
    }

    hasPlayerLost() {
        return this.lifes <= 0;
    }
}

class Entity {
    constructor(word, isEnemy) {
        this.word = word;
        this.isEnemy = isEnemy
        this.wordProgress = "";     // No destruction at the beginning
        this.hits = 0;
        this.age = 0;
    } 

    destruct(letter) {
        if (this.word[this.hits] == letter) {
            this.wordProgress += letter;
            this.hits += 1;
        } else {
            log("Incorrect destruction attempt. Tried: " + letter + ", actual: " + this.word[this.hits]);
        }
    }

    getRemaining() {
        return this.word.substr(this.hits, this.word.length);
    }

    // FUTURE: Expand by regenerate function
}


class EntityView {
    constructor(model, parentContainer, height) {
        this.model = model;
        this.parent = parentContainer;

        this.movementSpeedMultiplier = 1;
        this.shouldMoveUpward = true;

        // Create graphics object
        this.container = new PIXI.Container();

        // Visual text object for entity
        var text = this.prepareEntityText(model.word);
        
        // Entity Sprite
        var sprite = new PIXI.Sprite(
            PIXI.loader.resources["assets/images/entity_place_holder.png"].texture
            );
        sprite.anchor.set(0.5, 0.5);
        sprite.position.set(0, 24);
            
        this.container.addChild(text);
        this.container.addChild(sprite);

        // Randomize height in which the entity is going to be displayed.
        this.container.position.set(
            app.renderer.width,
            height /*Math.floor(Utils.randomNumberFromRange(250, 525))*/
        );

        // Prepare range for entity upward and downward movement
        // FUTURE: Determination whether to render entity with wings or not comes here.
        let movementRange = 15;
        this.movementRangeTop = this.container.y - movementRange;
        this.movementRangeBottom = this.container.y;
        
        // Put the child on screen
        this.parent.addChild(this.container);
    }

    prepareEntityText(text, style) {
        var textStyle = { "letterSpacing": 2, "fontFamily" : "Arial Black", "fill": "#000","fontSize": 20,"fontVariant": "small-caps"} ;
        if (style) {
            textStyle = style;
        }
        var textElement = new PIXI.Text(text, textStyle);
        
        textElement.anchor.set(0.5, 0.5);
        textElement.position.set(0, 0);

        return textElement;
    }

    setEntityMovementSpeedMultiplier(value) {
        this.movementSpeedMultiplier = value;
    }

    updateView() {
        // Iterate over childs of 'entity' container, replace text with most current
        // text of the model
        let textChildren;
        for(let i = 0; i < this.container.children.length; i++) {
            if (this.container.children[i] instanceof PIXI.Text) {
                textChildren = this.container.children[i];
            }
        }

        if (textChildren) { // Removing existing textChildren
            this.container.removeChild(textChildren);
        } 

        var textStyle = {
            "dropShadow": true,
            "dropShadowAlpha": 0.6,
            "dropShadowAngle": 0,
            "dropShadowBlur": 37,
            "dropShadowColor": "#dde94b",
            "dropShadowDistance": 0, 
            "letterSpacing": 2, 
            "fontFamily" : "Arial Black",
            "fill": "#d654e0",
            "fontSize": 20,
            "fontVariant": "small-caps", 
            "strokeThickness":2
        };
        let newText = this.prepareEntityText(this.model.getRemaining(), textStyle);
        
        // Put entity container on top of the others (it is active now)
        // Note that 'children.length' must be decreased as the index must exist. 
        this.parent.setChildIndex(
            this.container, 
            this.parent.children.length - 1
        );
        
        this.container.addChild(newText);

    }

    updateEntityDestruction(letter) {
        this.model.destruct(letter);
        this.updateView();
    }

    isEntityDestroyed() {
        return this.model.word == this.model.wordProgress;
    }

    destroyEntity() {
        this.container.removeChildren();
        this.container.destroy();
    }

    updateEntityMovement() {
        // Update entity age every tick by one
        this.model.age += 1;

        if (this.container.position.x > 0) {
            // Movement towards the player
            this.container.position.x -= 0.5 * this.movementSpeedMultiplier;
            
            // Linear movement up and down
            // Note: Everything is reversed, because [0,0] is top left corner.
            let updateJump = 0.5;
            if (this.container.position.y > this.movementRangeTop && this.shouldMoveUpward) {
                this.container.position.y -= updateJump;
            } else {
                this.shouldMoveUpward = false;
            }

            if (this.container.position.y < this.movementRangeBottom && this.shouldMoveUpward === false) {
                this.container.position.y += updateJump;
            } else {
                this.shouldMoveUpward = true;
            }
        } else {
            // Once it passes the player's side of the screen, subtract the 
            // life from player and destroy entity.
            FGManager.updateLifeIndicator(true);    // FUTURE: This is not nice way to do it. Poor design phase.
            FGManager.destroyEntity(this);
            log("Entity went of the screen. Putting it back to start.");
        }
    }
}