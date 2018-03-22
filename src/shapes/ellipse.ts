import { SplineC } from './splinec';
import { Line } from './line';
// import { CurveTo } from './../commands/curveto';
import { EPoint, ERectangle } from '@jwmb/geometry';
import { Shape } from './../shape';
import { CurveTo } from '../commands/index';

export class Ellipse extends Shape {
    private _boundingRect: ERectangle = new ERectangle(0, 0, 0, 0);
    public get boundingRectangle(): ERectangle { return this._boundingRect; }
    public set boundingRectangle(value: ERectangle) { this._boundingRect = value; }

    public constructor(rect: ERectangle = null, tensionVal: number = 1) {
        super();
        if (rect != null) {
            this._boundingRect = rect;
        }
        this.tension = tensionVal;
    }
    public tension = 1;
    // http://www.tinaja.com/glib/ellipse4.pdf
    private static _magicNumber4 = 0.551784;

    public toString(): string {
        return 'Ellipse:' + this._boundingRect.toString();
    }
    public move(p: EPoint) {
        this._boundingRect.x += p.x;
        this._boundingRect.y += p.y;
    }
    public copy() {
        return new Ellipse(this.boundingRectangle.copy(), this.tension);
    }
    // override
    public createGfxCmd(): Object {
        const tl = this._boundingRect.topLeft;
        const md = this._boundingRect.middle;
        const size = this._boundingRect.size;

        const mnXY = size.multiplyReturn(this.tension * Ellipse._magicNumber4 / 2);
        const br = this._boundingRect.bottomRight;
        const result = [];
        // result.push(new MoveTo(new EPoint(md.x, tl.y)));
        result.push(new CurveTo(
            new EPoint(md.x + mnXY.x, tl.y), // (100 + mn * 100) + ",0"
            new EPoint(br.x, md.y - mnXY.y), //// "200," + (100 - mn * 100)
            new EPoint(br.x, md.y))); //// 200,100
        result.push(new CurveTo(
            new EPoint(br.x, md.y + mnXY.y), // "200," + (100 + mn * 100)
            new EPoint(md.x + mnXY.x, br.y), // (100 + mn * 100) + ",200
            new EPoint(md.x, br.y))); // 100,200
        result.push(new CurveTo(
            new EPoint(md.x - mnXY.x, br.y), // (100 - mn * 100) + ",200
            new EPoint(tl.x, md.y + mnXY.y), // 0," + (100 + mn * 100)
            new EPoint(tl.x, md.y))); // 0,100
        result.push(new CurveTo(
            new EPoint(tl.x, md.y - mnXY.y), // 0," + (100 - mn * 100)
            new EPoint(md.x - mnXY.x, tl.y), // (100 - mn * 100) + ",0
            new EPoint(md.x, tl.y))); // 100,0
        return result;
    }
    // override
    public get startPoint(): EPoint { return new EPoint(this._boundingRect.middle.x, this._boundingRect.y); }
    // override
    public get endPoint(): EPoint { return this.startPoint; }

    public createSplines(): SplineC[] {
        const tl = this._boundingRect.topLeft;
        const br = this._boundingRect.bottomRight;
        const md = this._boundingRect.middle;
        // const size = this._boundingRect.size;

        const t = Ellipse._magicNumber4 * this.tension;
        const result = [];
        result.push(Ellipse.getQuarterSegment(new EPoint(md.x, tl.y), new EPoint(br.x, tl.y), new EPoint(br.x, md.y), t));
        result.push(Ellipse.getQuarterSegment(new EPoint(br.x, md.y), new EPoint(br.x, br.y), new EPoint(md.x, br.y), t));
        result.push(Ellipse.getQuarterSegment(new EPoint(md.x, br.y), new EPoint(tl.x, br.y), new EPoint(tl.x, md.y), t));
        result.push(Ellipse.getQuarterSegment(new EPoint(tl.x, md.y), new EPoint(tl.x, tl.y), new EPoint(md.x, tl.y), t));
        return result;
    }

    public static getQuarterSegment(ptStart: EPoint, ptCorner: EPoint, ptEnd: EPoint, magicNum: number = 0.551784): SplineC {
        return new SplineC(ptStart,
            Line.getPointOnLine(ptStart, ptCorner, magicNum),
            Line.getPointOnLine(ptEnd, ptCorner, magicNum),
            ptEnd);
    }
    public static getQuarterCurveTo(num: number, rect: ERectangle): CurveTo {
        return null;
    }

    public static fromCenterAndRadius(ptCenter: EPoint, radius: number, tension: number = 1): Ellipse {
        const rct = new ERectangle(ptCenter.x - radius, ptCenter.y - radius, radius * 2, radius * 2);
        return new Ellipse(rct, tension);
    }
}
