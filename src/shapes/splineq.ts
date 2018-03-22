import { SplineC } from './splinec';
import { EPoint } from '@jwmb/geometry';
import { Shape } from '../shape';
import { CurveTo } from '../commands/index';

export class SplineQ extends Shape {
    public anchorsAndControls: EPoint[] = [];

    public constructor(a0OrPoints: EPoint[] | EPoint = null, c: EPoint = null, a1: EPoint = null) {
        super();
        if (a0OrPoints) {
            if (typeof a0OrPoints === 'object' && a0OrPoints.constructor === Array) {
                this.anchorsAndControls = <EPoint[]>a0OrPoints;
            } else {
                this.anchorsAndControls.push(<EPoint>a0OrPoints);
                this.anchorsAndControls.push(c);
                this.anchorsAndControls.push(a1);
            }
        }
    }

    public createPrimitiveShapes(): any[] {
        return [];
    }
    move(pt: EPoint) {
        this.anchorsAndControls.forEach(_ => _.add(pt));
    }
    moveBy(pt: EPoint) {
        this.anchorsAndControls.forEach(_ => _.add(pt));
    }
    // override
    public get startPoint(): EPoint { return this.anchorsAndControls[0]; }
    // override
    public get endPoint(): EPoint { return this.anchorsAndControls[this.anchorsAndControls.length - 1]; }
    // override
    public copy(): Shape {
        return new SplineC(this.anchorsAndControls.map(_ => _.copy()));
    }
    // override
    public createGfxCmd(): Object {
        if (this.anchorsAndControls.length === 3) {
            return new CurveTo(this.anchorsAndControls[1], this.anchorsAndControls[2]);
        }
        const result = new Array();
        for (let i = 1; i < this.anchorsAndControls.length; i += 2) {
            result.push(new CurveTo(this.anchorsAndControls[i], this.anchorsAndControls[i + 1]));
        }
        return result;
    }
}
