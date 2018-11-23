const assetsFolder = "assets/";
const imagesFolder = assetsFolder + "images/";

const resources = [
    imagesFolder + "cloud_1.png",
    imagesFolder + "cloud_2.png"
]

const loadPIXIResources = loadedCallback => {
    PIXI.loader.add(resources).load(loadedCallback);
}