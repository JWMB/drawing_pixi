import { SplineQ } from './splineq';
import { Line } from './line';
import { CurveTo } from '../commands/index';
import { EPoint } from '@jwmb/geometry';
import { Shape } from '../shape';

export class SplineC extends Shape {
    public anchorsAndControls = <EPoint[]>[];

    public constructor(a0OrPoints: Object = null, c0: EPoint = null, c1: EPoint = null, a1: EPoint = null) {
        super();
        if (a0OrPoints) {
            if (typeof a0OrPoints === 'object' && a0OrPoints.constructor === Array) {
                this.anchorsAndControls = <EPoint[]>a0OrPoints;
            } else {
                this.anchorsAndControls.push(<EPoint>a0OrPoints);
                this.anchorsAndControls.push(c0);
                this.anchorsAndControls.push(c1);
                this.anchorsAndControls.push(a1);
            }
        }
    }

    public getSegment(index: number, numSegments: number = 1): SplineC {
        return new SplineC(this.anchorsAndControls.slice(index * 3, index * 3 + numSegments * 3 + 1));
    }

    // override
    public get startPoint(): EPoint { return this.anchorsAndControls[0]; }
    // override
    public get endPoint(): EPoint { return this.anchorsAndControls[this.anchorsAndControls.length - 1]; }
    // override
    public copy(): Shape {
        return new SplineC(this.anchorsAndControls.map(_ => _.copy()));
    }

    public createPrimitiveShapes(): any[] {
        return [];
    }

    // override
    public createGfxCmd(): any {
        const result = new Array();
        const qPoints = this.toQuadraticsPoints();
        for (let i = 1; i < qPoints.length - 1; i += 2) {
            result.push(new CurveTo(qPoints[i], qPoints[i + 1]));
        }
        return result;
        /*			if (this.anchorsAndControls.length == 4)
        return new CurveTo(this.anchorsAndControls[1], this.anchorsAndControls[2], this.anchorsAndControls[3]);

        for (var i:int = 1; i < this.anchorsAndControls.length; i+=3) {
        result.push(new CurveTo(this.anchorsAndControls[i], this.anchorsAndControls[i+1], this.anchorsAndControls[i+2]));
        }
        return result;*/
    }

    // override
    public move(ptMove: EPoint): void {
        this.anchorsAndControls.forEach(_ => _.add(ptMove));
    }

    public getInterpolatedPoint(time: number): EPoint {
        return SplineC.getInterpolated(this.anchorsAndControls[0], this.anchorsAndControls[1],
            this.anchorsAndControls[2], this.anchorsAndControls[3], time);
    }

    public static getDividedData(a0: EPoint, c0: EPoint, c1: EPoint, a1: EPoint, t3: number): any[] {
        const a3 = SplineC.getInterpolated(a0, c0, c1, a1, t3);
        const arr = SplineC.split(a0, c0, c1, a1, t3);
        arr.splice(2, 0, a3);
        return arr;
    }


    public getDivided(t: number): SplineC {
        // TODO: divide every segment, or find one place on the "compound" segment
        let newPoints = <EPoint[]>[];
        newPoints.push(this.startPoint);
        for (let i = 0; i < this.anchorsAndControls.length - 1; i += 3) {
            const arr = SplineC.getDividedData(this.anchorsAndControls[i], this.anchorsAndControls[i + 1],
                this.anchorsAndControls[i + 2], this.anchorsAndControls[i + 3], t);
            newPoints = newPoints.concat(arr);
            // result.push(new SplineC((this.anchorsAndControls[i] as Point).copy(), arr[0] as Point, arr[1] as Point, arr[2] as Point));
            // result.push(new SplineC(arr[2] as Point, arr[3] as Point, arr[4] as Point, (this.anchorsAndControls[i+3] as Point).copy()));
        }
        newPoints.push(this.endPoint);
        return new SplineC(newPoints);
    }

    public toQuadraticsPoints(): EPoint[] {
        let result = new Array();
        result.push(this.anchorsAndControls[0]);
        for (let i = 0; i < this.anchorsAndControls.length - 1; i += 3) {
            const arr = SplineC.cubicToQuadratic(this.anchorsAndControls[i], this.anchorsAndControls[i + 1],
                this.anchorsAndControls[i + 2], this.anchorsAndControls[i + 3]);
            result = result.concat(arr);
        }
        result.push(this.anchorsAndControls[this.anchorsAndControls.length - 1]);
        return result;
    }
    public toQuadratics(): SplineQ[] {
        const result = [];
        for (let i = 0; i < this.anchorsAndControls.length - 1; i += 3) {
            const arr = SplineC.cubicToQuadratic(this.anchorsAndControls[i], this.anchorsAndControls[i + 1],
                this.anchorsAndControls[i + 2], this.anchorsAndControls[i + 3]);
            result.push(new SplineQ(this.anchorsAndControls[i], arr[0], arr[1]));
            result.push(new SplineQ(arr[1], arr[2], arr[3]));
            result.push(new SplineQ(arr[3], arr[4], arr[5]));
            result.push(new SplineQ(arr[5], arr[6], this.anchorsAndControls[i + 3]));
        }
        return result;
    }

    public static cubicToQuadratic(a0: EPoint, c0: EPoint, c1: EPoint, a1: EPoint): EPoint[] {
        // From Bezier_lib.as - v1.2 - 19/05/02
        // Timothee Groleau, http://www.timotheegroleau.com/Flash/articles/cubic_bezier/bezier_lib.as

        // const Common = <any>{};
        // calculates the useful base points
        const PA = Line.getPointOnLine(a0, c0, 0.75);
        const PB = Line.getPointOnLine(a1, c1, 0.75);

        // get 1/16 of the [P3, P0] segment
        const dx = (a1.x - a0.x) / 16;
        const dy = (a1.y - a0.y) / 16;

        // calculates control point 1
        const Pc_1 = Line.getPointOnLine(a0, c0, 3.0 / 8);

        // calculates control point 2
        const Pc_2 = Line.getPointOnLine(PA, PB, 3.0 / 8);
        Pc_2.x -= dx;
        Pc_2.y -= dy;

        // calculates control point 3
        const Pc_3 = Line.getPointOnLine(PB, PA, 3.0 / 8);
        Pc_3.x += dx;
        Pc_3.y += dy;

        // calculates control point 4
        const Pc_4 = Line.getPointOnLine(a1, c1, 3.0 / 8);

        // calculates the 3 anchor points
        const Pa_1 = Line.getMiddle(Pc_1, Pc_2);
        const Pa_2 = Line.getMiddle(PA, PB);
        const Pa_3 = Line.getMiddle(Pc_3, Pc_4);

        // draw the four quadratic subsegments
        return [Pc_1, Pa_1, Pc_2, Pa_2, Pc_3, Pa_3, Pc_4];
        // result.push(Pc_1);result.push(Pa_1);result.push(Pc_2);result.push(Pa_2);result.push(Pc_3);result.push(Pa_3);result.push(Pc_4);
        // return result;
    }

    public static getInterpolated(a0: EPoint, c0: EPoint, c1: EPoint, a1: EPoint, time: number): EPoint {
        const t1 = 1.0 - time;
        const t1_2 = t1 * t1;
        const t_2 = time * time;

        c0 = c0.subtractReturn(a0);
        c1 = c1.subtractReturn(a1);
        const x = a0.x * t1_2 * t1 +
            (c0.x + a0.x) * 3.0 * time * t1_2 +
            (c1.x + a1.x) * 3.0 * t_2 * t1 +
            a1.x * time * t_2;
        const y = a0.y * t1_2 * t1 +
            (c0.y + a0.y) * 3.0 * time * t1_2 +
            (c1.y + a1.y) * 3.0 * t_2 * t1 +
            a1.y * time * t_2;
        return new EPoint(x, y);
        // a0 * t1_2 * t1 +
        // (c0 + a0) * 3.0 * time * t1_2 +
        // (c1 + a1) * 3f * t_2 * t1 +
        // a1 * time * t_2;
        // return a0.multiplyReturn(t1_2 * t1).addReturn(
        //                 c0.addReturn(a0).multiplyReturn(3.0 * time * t1_2).addReturn(
        //                 c1.addReturn(a1).multiplyReturn(3.0 * t_2 * t1).addReturn(
        //                 a1.multiplyReturn(time * t_2))));
    }


    public static split(a0: EPoint, c0: EPoint, c1: EPoint, a1: EPoint, t3: number): EPoint[] {
        const U = new EPoint(
            (c0.x - a0.x) * t3,
            (c0.y - a0.y) * t3);
        const V = new EPoint(
            ((c1.x - c0.x) * t3 - U.x) * t3,
            ((c1.y - c0.y) * t3 - U.y) * t3);

        const newc0 = new EPoint(
            U.x + a0.x,
            U.y + a0.y);
        const c2 = new EPoint(
            U.x + V.x + newc0.x,
            U.y + V.y + newc0.y);

        const R = new EPoint(
            (c1.x - a1.x) * (1.0 - t3),
            (c1.y - a1.y) * (1.0 - t3));
        const S = new EPoint(
            ((c0.x - c1.x) * (1.0 - t3) - R.x) * (1.0 - t3),
            ((c0.y - c1.y) * (1.0 - t3) - R.y) * (1.0 - t3));

        const newc1 = new EPoint(R.x + a1.x, R.y + a1.y);
        const c3 = new EPoint(R.x + S.x + newc1.x, R.y + S.y + newc1.y);

        // new: a0 -newc0-c2- P3 -c3-newc1- a1
        //        -newc0-c2-    -c3-newc1-
        return <EPoint[]>[newc0, c2, c3, newc1];
    }

    public static fromCatmullRom(points: EPoint[], tension: number = 0.5): SplineC {
        return new SplineC(SplineC.catmullRomToSplinesCPoints(points, tension));
    }
    public static catmullRomToSplinesCPoints(points: EPoint[], tension: number = 0.5): EPoint[] {
        // http://www.gamedev.net/community/forums/topic.asp?topic_id=308790
        // Points 1 and two are to be placed along the tangents at each point (just an edge average)

        if (true) {
            let p0 = points[0] as EPoint;
            let diff = (points[1] as EPoint).subtractReturn(p0);
            let p_1 = p0.subtractReturn(diff);
            points.splice(0, 0, p_1);

            p0 = points[points.length - 1] as EPoint;
            diff = p0.subtractReturn(points[points.length - 2] as EPoint);
            p_1 = p0.addReturn(diff);
            points.push(p_1);
        }
        const result = new Array();
        for (let i = 2; i < points.length - 1; i++) {
            const edge0 = new Line(points[i - 2], points[i - 1]);
            const edge1 = new Line(points[i - 1], points[i]);
            const edge2 = new Line(points[i], points[i + 1]);
            const tangent0 = (edge0.getNormalized().addReturn(edge1.getNormalized())).multiplyReturn(0.5);
            const tangent1 = (edge1.getNormalized().addReturn(edge2.getNormalized())).multiplyReturn(0.5);
            // The important thing is the length along the edge.  I'm using half the
            // length of the shortest edge surrounding the endpoint.  I wish I remember why.
            const length0 = Math.min(edge0.length, edge1.length) * tension;
            const length1 = Math.min(edge1.length, edge2.length) * tension;

            result.push(edge1.startPoint);
            result.push(edge1.startPoint.addReturn(tangent0.multiplyReturn(length0)));
            result.push(edge1.endPoint.subtractReturn(tangent1.multiplyReturn(length1)));
        }
        result.push(points[points.length - 2]);
        return result;
    }
}
