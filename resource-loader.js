const assetsFolder = "assets/";
const imagesFolder = assetsFolder + "images/";
const desertBiomeFolder = imagesFolder + "BIOM_DESERT/";
const winterBiomeFolder = imagesFolder + "BIOME_WINTER/";

const resources = [
    imagesFolder + "cloud_1.png",
    imagesFolder + "cloud_2.png",
    imagesFolder + "entity_place_holder.png",
    imagesFolder + "lock-50.png",
    imagesFolder + "heart-icon.png",
    desertBiomeFolder + "pyramid_01_huge.png",
    desertBiomeFolder + "pyramid_01_medium.png",
    desertBiomeFolder + "pyramid_01_ultrahuge.png",
    desertBiomeFolder + "pyramid_01_ultrasmall.png",
    desertBiomeFolder + "pyramid_01_small.png",
    desertBiomeFolder + "sandblock_01_huge.png",
    desertBiomeFolder + "sandblock_01_medium.png",
    desertBiomeFolder + "sandblock_01_small.png",
    desertBiomeFolder + "sandblock_01_ultrasmall.png",
    desertBiomeFolder + "sandwall_01_huge.png",
    desertBiomeFolder + "sandwall_01_medium.png",
    desertBiomeFolder + "sandwall_01_small.png",
    desertBiomeFolder + "sandwall_01_ultrasmall.png",
    desertBiomeFolder + "sandwall_02_huge.png",
    desertBiomeFolder + "sandwall_02_medium.png",
    desertBiomeFolder + "sandwall_02_small.png",
    desertBiomeFolder + "sandwall_02_ultrasmall.png",
    winterBiomeFolder + "angry_snowman_huge.png",
    winterBiomeFolder + "angry_snowman_ultrasmall.png",
    winterBiomeFolder + "dead_snowman_full_huge.png",
    winterBiomeFolder + "dead_snowman_full_ultrasmall.png",
    winterBiomeFolder + "dead_snowman_head_medium.png",
    winterBiomeFolder + "dead_snowman_head_small.png",
    winterBiomeFolder + "dead_snowman_head_ultrasmall.png",
    winterBiomeFolder + "snowball_pack_01_medium.png",
    winterBiomeFolder + "snowball_pack_01_small.png",
    winterBiomeFolder + "snowball_pack_01_ultrasmall.png",
    winterBiomeFolder + "snowball_pack_02_medium.png",
    winterBiomeFolder + "snowball_pack_02_small.png",
    winterBiomeFolder + "snowball_pack_02_ultrasmall.png",
    winterBiomeFolder + "snowball_small.png"
]

const loadPIXIResources = loadedCallback => {
    PIXI.loader.add(resources).load(loadedCallback);
}