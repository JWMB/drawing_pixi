import { EPoint } from '@jwmb/geometry';
import { GfxCmd } from './../gfxcmd';
import { GraphicsEx } from './../graphicsex';

// export namespace GfxCommands {

export class MoveTo extends GfxCmd {
    public point: EPoint;
    public constructor(p: EPoint = null) {
        super();
        if (p == null) {
            p = new EPoint(0, 0);
            // Didn't have this before - not sure if a reason it could be null...
            // Anyway, needed for ugly XmlInstantiator (can't find type easily without an instance...)
        }
        this.point = p;
    }
    // override
    public execute(gfx: GraphicsEx): void {
        gfx.moveTo(this.point.x, this.point.y);
    }
    // override
    public parse(cmdStr: string): string {
        const index = cmdStr.indexOf(' ', 2);
        this.point = EPoint.parse(cmdStr.substr(2, index - 1).replace(',', ';'));
        // race(this.toString() +" "+ index);
        return cmdStr.substr(index + 1);
    }
    // override
    public get commandLetter(): string {
        return 'M';
    }
    // override
    public toString(): string {
        return this.commandLetter + ' ' + this.point;
    }

    // TODO:
    //      //override
    // public applyTransform(m:Matrix):void {
    // 	this.point = EPoint.fromPoint(m.transformPoint(this.point.toPoint()));
    // }
    public copy(): GfxCmd {
        return new MoveTo(this.point);
    }

}
// }
