import * as ex from 'excalibur';
import { player, roomId, socket } from '../../serverConfig';

export class EX extends ex.Actor {
    isOn: boolean = false
    meterAmount: number = 0
    meterBars: number = 0
    enemy: boolean = false
    bar: ex.Rectangle = new ex.Rectangle({
        width: 300,
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
        this.graphics.layers.create({ name: 'bar', order: -2 })
        this.graphics.layers.create({ name: 'meter', order: -1 })
        this.graphics.layers.create({ name: 'meterOn', order: 1 })
        
        this.graphics.layers.get('bar').show(this.bar, { 
            offset: ex.vec(90, 30)
        })
        this.graphics.layers.get('meter').show(this.sprite)
        if(!this.enemy) {
            this.on('pointerdown', () => {
                this.isOn= !this.isOn
                socket.emit('ex-press', roomId, player, this.isOn.toString())
                this.changeColor()
            });
        } 
    }

    changeColor () {
        if(this.isOn) {
            this.graphics.layers.get('meter').hide()
            this.graphics.layers.get('meterOn').show(this.exOnSprite)
        } else {
            this.graphics.layers.get('meterOn').hide()
            this.graphics.layers.get('meter').show(this.sprite)
        }
                
    }
}