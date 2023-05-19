import * as ex from 'excalibur';

export class EX extends ex.Actor {
    isOn: boolean = false
    meterAmount: number = 0
    meterBars: number = 0
    enemy: boolean = false
    bar: ex.Rectangle = new ex.Rectangle({
        width: 0,
        height: 40,
        color: ex.Color.fromRGB(255, 255, 0, 1),
    })
    sprite: ex.Sprite
    exOnSprite: ex.Sprite

    constructor(position: ex.Vector, enemy = false, image: ex.ImageSource, exOn: ex.ImageSource) { 
        super({
            width: 100,
            height: 100,
            pos: position,
            anchor: ex.Vector.Zero,
        });
        this.enemy = enemy
        this.sprite = image.toSprite()
        this.exOnSprite = exOn.toSprite()
    }

    onInitialize() {
        this.graphics.layers.create({ name: 'default', order: -1 })
        this.graphics.layers.create({ name: 'meterOn', order: 1 })

        this.graphics.show(this.bar, { 
            offset: ex.vec(90, 30)
        })
        this.graphics.layers.get('default').show(this.sprite)
        if(!this.enemy) {
            this.on('pointerdown', () => {
                this.isOn= !this.isOn
                console.log(this.isOn)
                this.changeColor()
            });
        } 
    }

    changeColor () {
        console.log(this.graphics)
        if(this.isOn) {
            this.graphics.layers.get('default').hide()
            this.graphics.layers.get('meterOn').show(this.exOnSprite)
        } else {
            this.graphics.layers.get('meterOn').hide()
            this.graphics.layers.get('default').show(this.sprite)
        }
                
    }
}