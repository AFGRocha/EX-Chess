import * as ex from 'excalibur';
import { EXmeter } from '../../State/EXMeter.state';

export class EX extends ex.Actor {
    constructor(position: ex.Vector) { 
        super({
            width: 100,
            height: 100,
            pos: position,
            anchor: ex.Vector.Zero,
        });
    }

    onInitialize() {
        this.on('pointerdown', () => {
            EXmeter.isEXOn = !EXmeter.isEXOn
            console.log(EXmeter.isEXOn)
        });
    }
}