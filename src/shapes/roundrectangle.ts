import { Ellipse } from './ellipse';
import { SplineC } from './splinec';
import { LineTo, MoveTo } from '../commands/index';
import { Line } from './line';
import { Shape } from '../shape';
import { EPoint, ERectangle } from '@jwmb/geometry';

export class RoundRectangle extends Shape {
    // public var rectangle:ERectangle;
    private _rect: ERectangle;
    public get rectangle(): ERectangle { return this._rect; }
    public set rectangle(value: ERectangle) {
        if (value == null) {
            return;
        }
        this._rect = value;
        // var tmp:Array = new Array();
        // tmp.push(new EPoint(value.left, value.top));
        // tmp.push(new EPoint(value.right, value.top));
        // tmp.push(new EPoint(value.right, value.bottom));
        // tmp.push(new EPoint(value.left, value.bottom));
        // this.points = tmp;
    }


    private _ellipseSize = new EPoint(0, 0);
    public set ellipseSize(value: EPoint) { this._ellipseSize = value; }
    public get ellipseSize(): EPoint { return this._ellipseSize; }

    public tension: number;
    public constructor(rect: ERectangle = null, ellipseSze: EPoint = null, tensionVal: number = 1) {
        super();
        this.rectangle = rect;
        if (ellipseSze == null) {
            ellipseSze = new EPoint(0, 0);
        }
        this.ellipseSize = ellipseSze;
        this.tension = tensionVal;
    }

    public createPrimitiveShapes(): any[] {
        const ellipse = new Ellipse(new ERectangle(0, 0, this.ellipseSize.x, this.ellipseSize.y), this.tension);
        // var ellipse = new Ellipse(new ERectangle(this.rectangle.x, this.rectangle.y,
        // this.ellipseSize.x, this.ellipseSize.y), this.tension);
        const splines = ellipse.createSplines();
        const cornerSize = this.ellipseSize.multiplyReturn(0.5);

        const rr = [];
        let shape: Shape = null;
        rr.push(new Line(new EPoint(this.rectangle.x + cornerSize.x, this.rectangle.y),
            new EPoint(this.rectangle.right - cornerSize.x, this.rectangle.y)));
        shape = splines[0] as Shape;
        shape.move(new EPoint(this.rectangle.right - this.ellipseSize.x, this.rectangle.y));
        rr.push(shape);

        rr.push(new Line(shape.endPoint, new EPoint(this.rectangle.right, this.rectangle.bottom - cornerSize.y)));
        shape = splines[1] as Shape;
        shape.move(new EPoint(this.rectangle.right - this.ellipseSize.x, this.rectangle.bottom - this.ellipseSize.y));
        rr.push(shape);

        rr.push(new Line(shape.endPoint, new EPoint(this.rectangle.x + cornerSize.x, this.rectangle.bottom)));
        shape = splines[2] as Shape;
        shape.move(new EPoint(this.rectangle.x, this.rectangle.bottom - this.ellipseSize.y));
        rr.push(shape);

        rr.push(new Line(shape.endPoint, new EPoint(this.rectangle.x, this.rectangle.y + cornerSize.y)));
        shape = splines[3] as Shape;
        shape.move(new EPoint(this.rectangle.x, this.rectangle.y));
        rr.push(shape);

        return rr;
    }

    public get startPoint(): EPoint { return this.rectangle.topLeft; }
    public get endPoint(): EPoint { return this.rectangle.topLeft; }
    public copy() {
        return new RoundRectangle(this.rectangle.copy(), this.ellipseSize.copy(), this.tension);
    }
    public move(p: EPoint) {
        this._rect.x += p.x;
        this._rect.y += p.y;
    }

    public createGfxCmd(): Object {
        const ellipse = new Ellipse(new ERectangle(0, 0, this.ellipseSize.x, this.ellipseSize.y), this.tension);
        const splines = ellipse.createSplines();
        const cornerSize = this.ellipseSize.multiplyReturn(0.5);

        const result = [];

        result.push(new MoveTo(new EPoint(this.rectangle.x + cornerSize.x, this.rectangle.y)));
        result.push(new LineTo(new EPoint(this.rectangle.right - cornerSize.x, this.rectangle.y)));
        (<SplineC>splines[0]).move(new EPoint(this.rectangle.right - this.ellipseSize.x, this.rectangle.y));
        result.push((<SplineC>splines[0]).createGfxCmd());

        result.push(new LineTo(new EPoint(this.rectangle.right, this.rectangle.bottom - cornerSize.y)));
        (<SplineC>splines[1]).move(new EPoint(this.rectangle.right - this.ellipseSize.x, this.rectangle.bottom - this.ellipseSize.y));
        result.push((<SplineC>splines[1]).createGfxCmd());

        result.push(new LineTo(new EPoint(this.rectangle.x + cornerSize.x, this.rectangle.bottom)));
        (<SplineC>splines[2]).move(new EPoint(this.rectangle.x, this.rectangle.bottom - this.ellipseSize.y));
        result.push((<SplineC>splines[2]).createGfxCmd());

        result.push(new LineTo(new EPoint(this.rectangle.x, this.rectangle.y + cornerSize.y)));
        (<SplineC>splines[3]).move(new EPoint(this.rectangle.x, this.rectangle.y));
        result.push((<SplineC>splines[3]).createGfxCmd());

        return result;
    }
}
