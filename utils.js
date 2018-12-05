class Utils {

    static randomNumberFromRange (start, end)  {
        const range = end - start;
        return start + Math.random() * range;
    }

    static randomIntColor () {
        return parseInt(Math.floor(Math.random()*16777215).toString(16), 16)
    }

    static createSpriteFromGraphics(renderer, graphics) {
        let texture = PIXI.RenderTexture.create(
            graphics.width, graphics.height);
        
        renderer.render(graphics, texture);
        return new PIXI.Sprite(texture);
    }

    // Warning: O(n^2) complexity, use only for debug purposes.
    static makeId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < Math.floor(Utils.randomNumberFromRange(5, 15)); i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}

class WordSet {
    static getWordSetForLevel(level) {
        switch(level) {
            case 1: 
                return   [
                    "ITERATION",
                    "BURNUPCHART",
                    "ENTERPRISEARCHITECT",
                    "DISTRIBUTEDDEVELOPMENTTEAM",
                    "PARALLELDEVELOPMENT",
                    "SPRINTBACKLOG",
                    "BUSINESSOWNERS",
                    "ARCHITECTURALRUNWAY",
                    "STORYPOINTS",
                    "DEVELOPERSANDTESTERS",
                    "STORY",
                    "TECHNICALDEBT",
                    "LEAN",
                    "BUSINESSEPICS",
                    "PLANNINGGAME",
                    "VELOCITY",
                    "RETROSPECTIVE",
                    "ESTIMATION",
                    "SCALEDAGILEFRAMEWORK",
                    "COORDINATION"
                ];
            case 2: 
                return [
                    "SCALEDAGILEFRAMEWORK",
                    "TESTAUTOMATION",
                    "BACKLOG",
                    "MINIMUMMARKETABLEFEATURES",
                    "PATTERN",
                    "RELEASEPLAN",
                    "TECHNICALDEBT",
                    "COORDINATION",
                    "ROADMAP",
                    "PIRATEMETRICS",
                    "VOICEOFTHECUSTOMER",
                    "ITERATION",
                    "WORKINPROGRESS",
                    "DESIGNPATTERN",
                    "INTEGRATIONHELL",
                    "DEVOPS",
                    "FIBONACCISEQUENCE",
                    "ITERATIONPLAN",
                    "BUSINESSEPICS",
                    "SCRUM"
            ];
            case 3: 
                return [
                    "ITERATIONEXECUTION",
                    "ARCHITECTURALEPICS",
                    "BUILDPROCESS",
                    "REGRESSIONTEST",
                    "WORKINGSOFTWARE",
                    "PRODUCT",
                    "LEAN",
                    "BRANCHING",
                    "PRODUCTVISION",
                    "FIBONACCISEQUENCE",
                    "DEMO",
                    "SCRUMMASTER",
                    "FEATURETEAMS",
                    "COMPLEXITYPOINTS",
                    "PLANNINGGAME",
                    "AGILEPROJECTMANAGEMENT",
                    "SYSTEMDEMO",
                    "TEAM",
                    "XP",
                    "VERSIONCONTROL"
                ];
            case 4: 
                return [
                    "VERSIONCONTROL",
                    "PROGRAMEPICS",
                    "BUSINESSALIGNMENT",
                    "BACKLOGGROOMING",
                    "COLOCATION",
                    "FAILFAST",
                    "TEAMMEMBER",
                    "AGILEPROJECTMANAGEMENT",
                    "BUDGETS",
                    "FLOW",
                    "RELEASE",
                    "EXTREMEPROGRAMMING",
                    "RATIONALUNIFIEDPROCESS",
                    "CODEQUALITY",
                    "XP",
                    "MINIMUMMARKETABLEFEATURES",
                    "SUSTAINABLEPACE",
                    "PROGRAMINCREMENT",
                    "TASKBOARD",
                    "ROADMAP"
                ];
            case 5: 
                return  [
                    "XP",
                    "EPIC",
                    "EMPIRICISM",
                    "DYNAMICSYSTEMSDEVELOPMENTMETHOD",
                    "LEANSTARTUP",
                    "CRYSTAL",
                    "USEREXPERIENCE",
                    "BACKLOGITEMEFFORT",
                    "USERACCEPTANCETESTS",
                    "AGILESOFTWAREDEVELOPMENT",
                    "SPRINTREVIEW",
                    "METASCRUM",
                    "BOTTLENECK",
                    "LEAN",
                    "CERTIFIEDSCRUMMASTER",
                    "SPRINTPLANNINGMEETING",
                    "PARALLELDEVELOPMENT",
                    "USERROLES",
                    "BACKLOG",
                    "ARCHITECTURALEPICS"
                ];
            case 6: 
                return [
                    "CERTIFIEDSCRUMMASTER",
                    "LEANAGILELEADERS",
                    "SPRINTREVIEW",
                    "EXTREMEPROGRAMMING",
                    "SYSTEMDEMO",
                    "ITERATIONPLAN",
                    "DEVELOPERUNIT",
                    "BUSINESSEPICKANBAN",
                    "PRODUCTMANAGEMENT",
                    "EPICSTORIES",
                    "CROSSFUNCTIONALTEAM",
                    "RELEASEPLAN",
                    "CRYSTAL",
                    "TECHNICALDEBT",
                    "WORKINPROGRESS",
                    "TASK",
                    "PORTFOLIOVISION",
                    "BACKLOG",
                    "ACTUALTIMEESTIMATION",
                    "TIMEBOX"
                ];
            case 7: 
                return [
                    "KANBAN",
                    "SELFORGANIZATION",
                    "USERSTORY",
                    "INSPECTANDADAPT",
                    "EPICOWNER",
                    "SYSTEMARCHITECT",
                    "SCRUM",
                    "IDEALHOURS",
                    "FEATUREBASEDPLANNING",
                    "RELEASETRAINENGINEER",
                    "PRODUCTMANAGEMENT",
                    "ESTIMATION",
                    "PIRATEMETRICS",
                    "EPIC",
                    "CONTINUOUSDELIVERY",
                    "INTEGRATIONHELL",
                    "CERTIFIEDSCRUMMASTER",
                    "PRODUCTOWNER",
                    "SUSTAINABLEPACE",
                    "REFACTORING"
                ];
            case 8: 
                return [
                    "VOICEOFTHECUSTOMER",
                    "SPRINTPLANNINGMEETING",
                    "BUILDMEASURELEARN",
                    "BIGVISIBLECHARTS",
                    "REFACTORING",
                    "LEANSOFTWAREDEVELOPMENT",
                    "ARTMETRICS",
                    "TIMEBOX",
                    "DAILYSTANDUP",
                    "PORTFOLIOMETRICS",
                    "SELFORGANIZATION",
                    "AGILEDEVELOPMENTPRACTICES",
                    "DISTRIBUTEDDEVELOPMENTTEAM",
                    "ITERATIONEXECUTION",
                    "CUSTOMER",
                    "WIKI",
                    "TECHNICALDEBT",
                    "CROSSFUNCTIONALTEAM",
                    "PORTFOLIOBACKLOG",
                    "CODESMELL"
                ];
            case 9: 
                return [
                    "CAPACITY",
                    "NONFUNCTIONALREQUIREMENTS",
                    "BREAKINGTHEBUILD",
                    "STRATEGICTHEMES",
                    "CADENCE",
                    "CUSTOMER",
                    "INVEST",
                    "TEAMDEMO",
                    "PERSONA",
                    "CROSSFUNCTIONALTEAM",
                    "DAILYSTANDUP",
                    "PORTFOLIOMETRICS",
                    "EXTREMEPROGRAMMING",
                    "PIG",
                    "STORYPOINTS",
                    "BUILDMEASURELEARN",
                    "ITERATIONEXECUTION",
                    "PRODUCTMANAGEMENT",
                    "PLANNINGPOKER",
                    "TEAMPIOBJECTIVES"
                ];
            case 10: 
                return [
                    "SPRINT",
                    "TESTDRIVENDEVELOPMENT",
                    "IMPEDIMENT",
                    "UNITTESTING",
                    "CONTINUOUSINTEGRATION",
                    "TEAMPIOBJECTIVES",
                    "SCRUMTEAM",
                    "SUSTAINABLEPACE",
                    "RAPIDAPPLICATIONDEVELOPMENT",
                    "BUSINESSAGILITY",
                    "PARALLELDEVELOPMENT",
                    "DEVOPS",
                    "CERTIFIEDSCRUMMASTER",
                    "BIGVISIBLECHARTS",
                    "DOMAINMODEL",
                    "METASCRUM",
                    "BURNUPCHART",
                    "IDEALHOURS",
                    "KANBAN",
                    "SPRINTPLANNINGMEETING"
                ];
            case 11: 
                return [
                    "APPLICATIONLIFECYCLEMANAGEMENT",
                    "CODEQUALITY",
                    "DEMO",
                    "TEAM",
                    "SYSTEMTEAM",
                    "AGILEMANIFESTO",
                    "CUSTOMERUNIT",
                    "AGILERELEASETRAIN",
                    "STAKEHOLDER",
                    "FEATURE",
                    "REFACTORING",
                    "STRATEGICTHEMES",
                    "DEVELOPERSANDTESTERS",
                    "STANDUPMEETING",
                    "ITALIGNMENT",
                    "KANBAN",
                    "SPRINTPLANNINGMEETING",
                    "TESTAUTOMATION",
                    "CROSSFUNCTIONALTEAM",
                    "RETROSPECTIVE"
                ];
            case 12: 
                return [
                    "SHAREDRESOURCES",
                    "PLANNINGPOKER",
                    "CHICKEN",
                    "VELOCITY",
                    "ARCHITECTURALFEATURE",
                    "RELEASE",
                    "PROGRAMPIOBJECTIVES",
                    "TASKBOARD",
                    "MOSCOW",
                    "DESIGNPATTERN",
                    "LEAN",
                    "TECHNICALDEBT",
                    "EMPIRICISM",
                    "DOMAINMODEL",
                    "FIVELEVELSOFAGILEPLANNING",
                    "PARALLELDEVELOPMENT",
                    "BURNDOWNCHART",
                    "PRODUCTMANAGEMENT",
                    "DEVOPS",
                    "EPICOWNER"
                ];
            case 13: 
                return [
                    "KANOANALYSIS",
                    "AGILEDEVELOPMENTPRACTICES",
                    "FIVELEVELSOFAGILEPLANNING",
                    "USERROLES",
                    "CONTINUOUSDELIVERY",
                    "ACCEPTANCETESTING",
                    "ESTIMATION",
                    "PIG",
                    "PRODUCTBACKLOG",
                    "BURNDOWNCHART",
                    "SYSTEMARCHITECT",
                    "BUSINESSOWNERS",
                    "EPICOWNER",
                    "ENTERPRISEARCHITECT",
                    "VELOCITY",
                    "PORTFOLIOVISION",
                    "STRATEGICTHEMES",
                    "FEATUREBASEDPLANNING",
                    "CONTINUOUSINTEGRATION",
                    "PRODUCT"
                ];
            case 14: 
                return [
                    "SPIKE",
                    "BUSINESSEPICS",
                    "PLANNINGGAME",
                    "WIKI",
                    "PORTFOLIOBACKLOG",
                    "CONTINUOUSDEPLOYMENT",
                    "FEATURETEAMS",
                    "PORTFOLIOVISION",
                    "PROGRAMBACKLOG",
                    "DOMAINMODEL",
                    "BACKLOGITEM",
                    "AGILEPROJECTMANAGEMENT",
                    "PRODUCTVISION",
                    "PRODUCT",
                    "TEAMPIOBJECTIVES",
                    "STANDUPMEETING",
                    "AGILESOFTWAREDEVELOPMENT",
                    "DEVELOPERSANDTESTERS",
                    "LEANSTARTUP",
                    "WORKINGSOFTWARE"
                ];
            case 15: 
                return [
                    "BACKLOGITEM",
                    "ARCHITECTURALEPICKANBAN",
                    "ITERATIONRETROSPECTIVE",
                    "MINIMUMVIABLEPRODUCT",
                    "COMPLEXITYPOINTS",
                    "RATIONALUNIFIEDPROCESS",
                    "ITALIGNMENT",
                    "BUSINESSVALUE",
                    "PAIRPROGRAMMING",
                    "EMERGENCE",
                    "ACTUALTIMEESTIMATION",
                    "AGILEMANIFESTO",
                    "REFACTORING",
                    "DOMAINMODEL",
                    "LEANSTARTUP",
                    "DAILYSTANDUP",
                    "TESTAUTOMATION",
                    "CONTINUOUSDEPLOYMENT",
                    "FEATUREBASEDPLANNING",
                    "TEAMMEMBER"
                ];
            case 16: 
                return [
                    "PROGRAMPORTFOLIOMANAGEMENT",
                    "INTEGRATIONHELL",
                    "RELEASEPLANNING",
                    "INNOVATIONANDPLANNING",
                    "CODESMELL",
                    "ACTUALTIMEESTIMATION",
                    "DEFINITIONOFDONE",
                    "METASCRUM",
                    "PRODUCTOWNER",
                    "PROGRAMINCREMENT",
                    "BACKLOGGROOMING",
                    "VERSIONCONTROL",
                    "KANBAN",
                    "BACKLOGITEMEFFORT",
                    "ARCHITECTURALEPICS",
                    "USERACCEPTANCETESTS",
                    "FEATURE",
                    "CONTINUOUSDEPLOYMENT",
                    "FEATUREBASEDPLANNING",
                    "FLOW"
                ];
        }
    }
}