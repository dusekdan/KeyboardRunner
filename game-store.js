class GameStore {
    static checkStorageExist() {
        var storage = window.localStorage;
        let storageNotExists = storage.getItem('storageCreated') === null;

        return !storageNotExists;
    }

    static createFreshStorage() {
        var storage = window.localStorage;

        // Wipe whatever junk was in local storage before
        storage.clear();

        // Create scoreboard object
        let scoreBoard = {};
        for (let i = 1; i < 17; i++) {
            scoreBoard[i] = [];
        }
        storage.setItem('scoreboard', JSON.stringify(scoreBoard));

        // Level unlocking progress
        storage.setItem('lastUnlockedLevel', '1');

        storage.setItem('storageCreated', 'true');
        log("GameStore created.");
    }

    static saveScore(level, score, name) {
        var storage = window.localStorage;
        if (name === undefined || name.trim() === "") {
            name = "Unknown runner";
        } 

        let scoreObject = {
            "score" : score,
            "name" : name
        };

        let currentScoreItem = storage.getItem('scoreboard');
        let scores = JSON.parse(currentScoreItem);

        scores[level].push(scoreObject);
        
        storage.setItem('scoreboard', JSON.stringify(scores));
    }

    static setLevelCompleted(level) {
        var storage = window.localStorage;

        let lastUnlockedLevel = parseInt(storage.getItem('lastUnlockedLevel'));
        if (lastUnlockedLevel < 16) {
            let expectedLevelToUnlock = lastUnlockedLevel + 1;
            if (level + 1 !== expectedLevelToUnlock) {
                log("ERROR,Security: Can not unlock level " + level  + " until previous levels are completed.");
            } else {
                storage.setItem('lastUnlockedLevel', expectedLevelToUnlock)
                log("Level " + level + " unlocked.");
            }
        } else {
            log("Level " + level + " can not be unlocked. There are only 16 levels in total.");
        }
    }

    static getLastUnlockedLevel() {
        return window.localStorage.getItem('lastUnlockedLevel');
    }


}