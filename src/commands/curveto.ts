import { EPoint } from '@jwmb/geometry';
import { GfxCmd } from './../gfxcmd';
import { GraphicsEx } from './../graphicsex';
import { SplineC } from '../shapes/index';

// export namespace GfxCommands {

export class CurveTo extends GfxCmd {
    public anchor: EPoint;
    public control: EPoint;
    public control2: EPoint;
    public constructor(ctrl: EPoint = null, anchOrCtrl2: EPoint = null, anch: EPoint = null) {
        super();
        this.control = ctrl;
        if (anch != null) {
            this.anchor = anch;
            this.control2 = anchOrCtrl2;
        } else {
            this.anchor = anchOrCtrl2;
        }
    }

    // public static function fromSplineQ(spline:SplineQ):CurveTo {
    // return new CurveTo(spline.control, spline.anchor1);
    // }

    // override
    public execute(gfx: GraphicsEx) {
        if (this.control2 != null) {
            const cubic = new SplineC(gfx.turtle, this.control, this.control2, this.anchor);
            const quads = cubic.toQuadratics();
            gfx.executeCommands(GraphicsEx.createCommands(quads, gfx.turtle));
            // gfx.drawShapes(quads);
            // for each (var quad:SplineQ in quads)
            // 	gfx.executeCommands(quad.createGfxCmd());
        } else {
            gfx.curveTo(this.control.x, this.control.y, this.anchor.x, this.anchor.y);
        }
    }

    // override
    public parse(cmdStr: string): string {
        let index = cmdStr.indexOf(' ', 2);
        this.control = EPoint.parse(cmdStr.substr(2, index - 1).replace(',', ';'));
        let index2 = cmdStr.indexOf(' ', index + 1);
        if (index2 < 0) { index2 = cmdStr.length; }
        this.anchor = EPoint.parse(cmdStr.substring(index, index2).replace(',', ';'));

        let result = cmdStr.substr(index2 + 1);
        if (result.length === 0) {
            return result;
        }

        const xx = parseInt(result.charAt(0), 10);
        if (!isNaN(xx)) {
            // Cubic curve! Need another control point.
            index = result.indexOf(' ', 1);
            let pt: EPoint = null;
            if (index < 0) {
                pt = EPoint.parse(result.replace(',', ';'));
                result = '';
            } else {
                pt = EPoint.parse(result.substr(0, index).replace(',', ';'));
                result = result.substr(index + 1);
            }
            this.control2 = this.anchor;
            this.anchor = pt;
        }
        return result;
    }

    // override
    public get commandLetter(): string {
        return 'C';
    }

    // override
    public toString(): string {
        return this.commandLetter + ' ' + this.control + ' ' + this.anchor;
    }

    // TODO:
    //      //override
    // public applyTransform(m: Matrix):void {
    // 	this.anchor = Point.fromPoint(m.transformPoint(this.anchor.toPoint()));
    // 	this.control = Point.fromPoint(m.transformPoint(this.control.toPoint()));
    // 	if (this.control2 != null)
    // 		this.control2 = Point.fromPoint(m.transformPoint(this.control2.toPoint()));
    // }

    // override
    public copy(): GfxCmd {
        return new CurveTo(this.control, this.anchor, this.control2);
    }
    public static cubicToQuadratic(anchor1: EPoint, ctrl1: EPoint, ctrl2: EPoint, anchor2: EPoint): CurveTo[] {
        const arr = SplineC.cubicToQuadratic(anchor1, ctrl1, ctrl2, anchor2);
        const result = [];
        result.push(new CurveTo(arr[0], arr[1]));
        result.push(new CurveTo(arr[2], arr[3]));
        result.push(new CurveTo(arr[4], arr[5]));
        result.push(new CurveTo(arr[6], anchor2));
        return result;
    }

}
// }
