import * as ex from 'excalibur';

export class AvailableMove extends ex.Actor {
    constructor(position: ex.Vector, availableTileColor: ex.Color) { 
        super({
            width: 100,
            height: 100,
            pos: position,
            color: availableTileColor
        });
    }
}