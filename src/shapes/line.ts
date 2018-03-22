import { LineTo } from './../commands/index';
import { EPoint } from '@jwmb/geometry';
import { Shape } from '../shape';
import { GfxCmd } from '../gfxcmd';

export class Line extends Shape {
    public anchor0: EPoint;
    public anchor1: EPoint;
    public constructor(a0: EPoint, a1: EPoint) {
        super();
        this.anchor0 = a0;
        this.anchor1 = a1;
    }

    // override
    public createGfxCmd(): GfxCmd {
        return new LineTo(this.anchor1);
    }
    // override
    public get startPoint(): EPoint { return this.anchor0; }
    // override
    public get endPoint(): EPoint { return this.anchor1; }
    public move(p: EPoint) {
        this.anchor0.add(p);
        this.anchor1.add(p);
    }
    public copy(): Shape {
        return new Line(this.anchor0.copy(), this.anchor1.copy());
    }
    public get length(): number {
        const x = this.anchor1.x - this.anchor0.x;
        const y = this.anchor1.y - this.anchor0.y;
        return Math.sqrt(x * x + y * y);
    }

    public getNormalized(): EPoint {
        const x = this.anchor1.x - this.anchor0.x;
        const y = this.anchor1.y - this.anchor0.y;
        const len = Math.sqrt(x * x + y * y);
        return new EPoint(x / len, y / len);
    }

    public getIntersection(p0: EPoint, p1: EPoint): EPoint {
        return Line.calcLineLineCollision(this.anchor0, this.anchor1, p0, p1);
    }

    public static getPointOnLine(p0: EPoint, p1: EPoint, ratio: number): EPoint {
        return new EPoint((p0.x + ((p1.x - p0.x) * ratio)), (p0.y + ((p1.y - p0.y) * ratio)));
    }
    public static getMiddle(p0: EPoint, p1: EPoint): EPoint {
        return new EPoint((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
    }

    public static getClosestPointOnOrigoLine(pLineStartingAtOrigo: EPoint, pCheck: EPoint): EPoint {
        let pHit: EPoint;
        if (pLineStartingAtOrigo.x === 0) {
            pHit = new EPoint(0, pCheck.y);
        } else {
            if (pLineStartingAtOrigo.y === 0) {
                pHit = new EPoint(pCheck.x, 0);
            } else {
                // equation: y = ax + b
                // we know a for pDiff line:
                const a1 = pLineStartingAtOrigo.y / pLineStartingAtOrigo.x;
                // and we want a for other line to be perpendicular to a1
                const a2 = -1.0 / a1;

                // b for line 1 is always 0. For line 2, we have to calculate.
                // We know that it goes through pMouse:
                // pCheck.y = a2*pCheck.x + b2
                const b2 = pCheck.y - a2 * pCheck.x;

                // a1x + b1 = a2x + b2  ->  a1x - a2x = b2 - b1  -> x = (b2-b1)/(a1-a2)      (b1 == 0)
                const x = b2 / (a1 - a2);
                pHit = new EPoint(x, a1 * x);
            }
        }
        // TODO: test if outside line end points
        return pHit;
    }
    public static getClosestPointOnLine(pLine1: EPoint, pLine2: EPoint, pCheck: EPoint): EPoint {
        const pDiff = pLine2.subtractReturn(pLine1);
        pCheck.subtract(pLine1);
        return Line.getClosestPointOnOrigoLine(pDiff, pCheck).addReturn(pLine1);
    }

    public static getDistanceFromLine(pLine1: EPoint, pLine2: EPoint, pCheck: EPoint): number {
        const p = Line.getClosestPointOnLine(pLine1, pLine2, pCheck);
        const pDiff = pCheck.subtractReturn(p);
        return pDiff.length;
    }

    public static calcLineLineCollision(pt1_1: EPoint, pt1_2: EPoint, pt2_1: EPoint, pt2_2: EPoint): EPoint {
        let bLine1GotA = true;
        let bLine2GotA = true;

        let line1A = 0;
        let line2A = 0;
        let line1B = 0;
        let line2B = 0;

        if (pt1_2.x - pt1_1.x !== 0) {
            line1A = (pt1_2.y - pt1_1.y) / (pt1_2.x - pt1_1.x);
            line1B = pt1_1.y - pt1_1.x * line1A;
        } else {
            bLine1GotA = false;
        }

        if (pt2_2.x - pt2_1.x !== 0) {
            line2A = (pt2_2.y - pt2_1.y) / (pt2_2.x - pt2_1.x);
            line2B = pt2_1.y - pt2_1.x * line2A; // lineRect2.Top-lineRect2.Left
        } else {
            bLine2GotA = false;
        }

        if (line1A === line2A) {
            if (bLine1GotA && bLine2GotA) {
                return null;
            }
        }

        const result = new EPoint(0, 0);
        if (line1B === line2B) {
            result.x = 0;
            result.y = line1B;
        }
        if (bLine1GotA && bLine2GotA) {
            result.x = (line2B - line1B) / (line1A - line2A);
            result.y = line1A * result.x + line1B;
        } else if (bLine1GotA) {
            result.x = pt2_1.x; // .Left;
            result.y = line1A * result.x + line1B; // (result.y-line1B)/line1A;
        } else if (bLine2GotA) {
            result.x = pt1_1.x; // .Left;
            result.y = line2A * result.x + line2B;
            // result.y = lineRect1.Left;
            // result.x = (result.y-line2B)/line2A;
        }

        // TODO:!!
        // is point on both lines' segments?
        /*
        var fRoundError:Number = 0.001;
        NormalizeRect(ref lineRect1);
        NormalizeRect(ref lineRect2);
        if (result.x - lineRect1.Left < -fRoundError || result.x - lineRect2.Left < -fRoundError)
            return null;
        if (result.x - lineRect1.Right > fRoundError || result.x - lineRect2.Right > fRoundError)
            return null;
        if (result.y - lineRect1.Top < -fRoundError || result.y - lineRect2.Top < -fRoundError)
            return null;
        if (result.y - lineRect1.Bottom > fRoundError || result.y - lineRect2.Bottom > fRoundError)
            return null;
*/
        return result;
    }

    public static getLinesCollide(ptA1: EPoint, ptA2: EPoint, ptB1: EPoint, ptB2: EPoint): boolean {
        const f = ((ptA2.x - ptA1.x) * (ptB2.y - ptB1.y) - (ptA2.y - ptA1.y) * (ptB2.x - ptB1.x));
        if (f === 0) {
            return false;
        }

        const d = ((ptA1.y - ptB1.y) * (ptB2.x - ptB1.x) - (ptA1.x - ptB1.x) * (ptB2.y - ptB1.y));
        if (f > 0) {
            if (d < 0 || d > f) {
                return false;
            }
        } else {
            if (d > 0 || d < f) {
                return false;
            }
        }

        const e = ((ptA1.y - ptB1.y) * (ptA2.x - ptA1.x) - (ptA1.x - ptB1.x) * (ptA2.y - ptA1.y));
        if (f > 0) {
            if (e < 0 || e > f) {
                return false;
            }
        } else {
            if (e > 0 || e < f) {
                return false;
            }
        }
        return true;
    }
}
