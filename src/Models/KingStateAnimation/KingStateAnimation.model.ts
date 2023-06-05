import * as ex from 'excalibur';

export class KingStateAnimation extends ex.Actor {
    sprite: ex.Sprite

    constructor(asset: ex.ImageSource) {
        super({pos: ex.vec(-250, 400)})
        this.sprite = asset.toSprite()
    }

    onInitialize() {
        this.graphics.add(this.sprite);
    }

    animate() {
        this.actions.moveTo(ex.vec(370, 400), 800)
        this.actions.moveTo(ex.vec(400, 400), 20)
        this.actions.moveTo(ex.vec(1100, 400), 800)
    }
}