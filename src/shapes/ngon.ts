import { LineTo } from '../commands/index';
import { EPoint, ERectangle } from '@jwmb/geometry';
import { Shape } from '../shape';

export class NGon extends Shape {
    public numCorners: number;
    public radius: number;
    public radiiVariations: number[];
    public rectangle = new ERectangle(0, 0, 200, 200);

    public constructor(centerOrRect: Object = 0, numCornersVal: number = 0, radiusVal: number = 0, radiiVariationsVal: number[] = null) {
        super();
        if (centerOrRect != null && centerOrRect instanceof EPoint) {
            this.rectangle = new ERectangle((<EPoint>centerOrRect).x - radiusVal,
                (<EPoint>centerOrRect).y - radiusVal, radiusVal * 2, radiusVal * 2);
        }
        this.numCorners = numCornersVal;
        this.radius = radiusVal;
        this.radiiVariations = radiiVariationsVal;
    }

    move(p: EPoint) {
        this.rectangle.x += p.x;
        this.rectangle.y += p.y;
    }
    copy() {
        return new NGon(this.rectangle, this.numCorners, this.radius, this.radiiVariations);
    }

    public get startPoint(): EPoint {
        return this.rectangle.middle.addReturn(
            new EPoint(0, -this.radius * (this.radiiVariations == null ? 1 : this.radiiVariations[0])));
    }
    public get endPoint(): EPoint { return this.startPoint; }
    public createGfxCmd(): Object {
        const angleStep: number = Math.PI * 2 / this.numCorners;
        // race("NGon RECT: " + rectangle._debug); // + " numC:" + radius + " );
        // var angle:Number = 0;
        const result = [];
        // result.push(new MoveTo());
        for (let i = 0; i < this.numCorners; i++) {
            let r = this.radius;
            if (this.radiiVariations != null) {
                r *= this.radiiVariations[i % this.radiiVariations.length];
            }
            const lt = new LineTo(EPoint.fromLengthAndAngle(r, angleStep * i).addReturn(this.rectangle.middle));
            result.push(lt);
        }
        result.push(new LineTo(this.startPoint));
        return result;
    }
}
