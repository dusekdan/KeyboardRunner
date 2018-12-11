const assetsFolder = "assets/";
const imagesFolder = assetsFolder + "images/";

const resources = [
    imagesFolder + "cloud_1.png",
    imagesFolder + "cloud_2.png",
    imagesFolder + "entity_place_holder.png",
    imagesFolder + "lock-50.png",
    imagesFolder + "heart-icon.png"
]

const loadPIXIResources = loadedCallback => {
    PIXI.loader.add(resources).load(loadedCallback);
}