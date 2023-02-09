import * as ex from 'excalibur';

export class EX extends ex.Actor {
    isOn: boolean = false
    meterAmount: number = 0
    meterBars: number = 0
    label: ex.Label = new ex.Label({
        text: 'EX',
        pos: ex.vec(12, 80),
        font: new ex.Font({
            family: 'impact',
            size: 80,
            unit: ex.FontUnit.Px
        })
    })
    bar: ex.Rectangle = new ex.Rectangle({
        width: 300,
        height: 40,
        color: ex.Color.fromRGB(255, 255, 0, 1),
    })
    constructor(position: ex.Vector) { 
        super({
            width: 100,
            height: 100,
            pos: position,
            anchor: ex.Vector.Zero,
        });
    }

    onInitialize() {
        this.graphics.show(this.bar, { 
            offset: ex.vec(90, 30)
        })
        this.addChild(this.label)
        this.on('pointerdown', () => {
            this.isOn= !this.isOn
            console.log(this.isOn)
            this.changeColor()
        });
    }

    changeColor () {
        if(this.isOn)
                this.label.color = ex.Color.fromRGB(255, 0, 0, 1)
            else
                this.label.color = ex.Color.fromRGB(0, 0, 0, 1)
    }
}