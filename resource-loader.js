const assetsFolder = "assets/";
const imagesFolder = assetsFolder + "images/";
const desertBiomFolder = imagesFolder + "BIOM_DESERT/"

const resources = [
    imagesFolder + "cloud_1.png",
    imagesFolder + "cloud_2.png",
    imagesFolder + "entity_place_holder.png",
    imagesFolder + "lock-50.png",
    imagesFolder + "heart-icon.png",
    desertBiomFolder + "pyramid_01_huge.png",
    desertBiomFolder + "pyramid_01_medium.png",
    desertBiomFolder + "pyramid_01_ultrahuge.png",
    desertBiomFolder + "pyramid_01_ultrasmall.png",
    desertBiomFolder + "pyramid_01_small.png",
    desertBiomFolder + "sandblock_01_huge.png",
    desertBiomFolder + "sandblock_01_medium.png",
    desertBiomFolder + "sandblock_01_small.png",
    desertBiomFolder + "sandblock_01_ultrasmall.png",
    desertBiomFolder + "sandwall_01_huge.png",
    desertBiomFolder + "sandwall_01_medium.png",
    desertBiomFolder + "sandwall_01_small.png",
    desertBiomFolder + "sandwall_01_ultrasmall.png",
    desertBiomFolder + "sandwall_02_huge.png",
    desertBiomFolder + "sandwall_02_medium.png",
    desertBiomFolder + "sandwall_02_small.png",
    desertBiomFolder + "sandwall_02_ultrasmall.png"
]

const loadPIXIResources = loadedCallback => {
    PIXI.loader.add(resources).load(loadedCallback);
}