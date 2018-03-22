import { GraphicsEx } from './../graphicsex';
import { GfxCmd } from './../gfxcmd';
import { ERectangle } from '@jwmb/geometry';

// export namespace GfxCommands {

export class DrawEllipse extends GfxCmd {
    public constructor(public rectangle: ERectangle) {
        super();
    }

    // override
    public execute(gfx: GraphicsEx): void {
        gfx.drawEllipse(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height);
    }
    public copy(): GfxCmd {
        return new DrawEllipse(this.rectangle);
    }

    public parse(cmdStr: string): string {
        throw Error('Not implemented');
        // var index= cmdStr.indexOf(" ", 2);
        // this.point = Point.parse(cmdStr.substr(2, index - 1));
        // return cmdStr.substr(index + 1);
    }
    public get commandLetter(): string {
        throw Error('Not implemented');
        // return "M";
    }
    public toString(): string {
        throw Error('Not implemented');
        // return this.commandLetter + " " + this.point;
    }

}
// }
