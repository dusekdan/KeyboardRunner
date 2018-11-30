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
}