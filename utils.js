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