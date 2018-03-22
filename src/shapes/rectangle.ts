import { EPoint, ERectangle } from '@jwmb/geometry';
import { Polygon } from './polygon';

export class Rectangle extends Polygon {
    private _rect: ERectangle;
    public get rectangle(): ERectangle { return this._rect; }
    public set rectangle(val: ERectangle) {
        if (val === null) {
            return;
        }
        this.points = [
            new EPoint(val.left, val.top),
            new EPoint(val.right, val.top),
            new EPoint(val.right, val.bottom),
            new EPoint(val.left, val.bottom)
        ];
    }
    public constructor(rect: ERectangle = null) {
        super();
        this.closed = true;
        this.rectangle = rect;
    }

    /*override public function get startPoint():EPoint{ return rectangle.topLeft; }
    override public function get endPoint():EPoint { return rectangle.topLeft; }
    override public function createGfxCmd():Object {
    var result:Array = new Array();
    result.push(new LineTo(new EPoint(this.rectangle.right, this.rectangle.y)));
    result.push(new LineTo(new EPoint(this.rectangle.right, this.rectangle.bottom)));
    result.push(new LineTo(new EPoint(this.rectangle.x, this.rectangle.bottom)));
    result.push(new LineTo(new EPoint(this.rectangle.x, this.rectangle.y)));
    return result;
    }*/
}
