const assetsFolder = "assets/";
const imagesFolder = assetsFolder + "images/";

const resources = [
    imagesFolder + "cloud_1.png",
    imagesFolder + "cloud_2.png",
    imagesFolder + "entity_place_holder.png",
    imagesFolder + "lock-50.png",
    imagesFolder + "heart-icon.png",
    imagesFolder + "pyramid_01_huge.png",
    imagesFolder + "pyramid_01_medium.png",
    imagesFolder + "pyramid_01_ultrahuge.png",
    imagesFolder + "pyramid_01_ultrasmall.png",
    imagesFolder + "pyramid_01_small.png",
    imagesFolder + "sandblock_01_huge.png",
    imagesFolder + "sandblock_01_medium.png",
    imagesFolder + "sandblock_01_small.png",
    imagesFolder + "sandblock_01_ultrasmall.png",
    imagesFolder + "sandwall_01_huge.png",
    imagesFolder + "sandwall_01_medium.png",
    imagesFolder + "sandwall_01_small.png",
    imagesFolder + "sandwall_01_ultrasmall.png",
    imagesFolder + "sandwall_02_huge.png",
    imagesFolder + "sandwall_02_medium.png",
    imagesFolder + "sandwall_02_small.png",
    imagesFolder + "sandwall_02_ultrasmall.png"
]

const loadPIXIResources = loadedCallback => {
    PIXI.loader.add(resources).load(loadedCallback);
}