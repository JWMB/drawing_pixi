import { MoveTo, LineTo } from '../commands/index';
import { EPoint } from '@jwmb/geometry';
import { Shape } from '../shape';
export class Polygon extends Shape {
    public constructor(public points: EPoint[] = null, public closed: boolean = true) {
        super();
    }

    public createGfxCmd(): Object {
        const result = [];
        result.push(new MoveTo(this.points[0]));
        for (let i = 1; i < this.points.length; i++) {
            result.push(new LineTo(this.points[i]));
        }
        if (this.closed) {
            result.push(new LineTo(this.points[0]));
        }
        return result;
    }
    public get startPoint(): EPoint { return this.points[0]; }
    public get endPoint(): EPoint { return this.closed ? this.startPoint : this.points[this.points.length - 1]; }
    public copy() {
        return new Polygon(this.points.map(_ => _.copy()), this.closed);
    }
    public move(p: EPoint) {
        this.points.forEach(_ => _.add(p));
    }
    public getLengthBetweenPoints(index1: number, index2: number): number {
        let len = 0;
        if (index2 < 0) {
            index2 = this.points.length + index2;
        }

        if (index2 <= index1) {
            len += this.getLengthBetweenPoints(index1, this.points.length - 1);
            // wrap around:
            len += this.points[this.points.length - 1].subtractReturn(this.points[0]).length;
            if (index1 > 0) {
                len += this.getLengthBetweenPoints(0, index1);
            }
            return len;
        }

        let last = this.points[index1];
        for (let i = index1 + 1; i <= index2; i++) {
            const current = this.points[i];
            len += current.subtractReturn(last).length;
            last = current;
        }
        return len;
    }
    public getPointOnPath(distanceFromStart: number): EPoint {
        // List<float> waypoints = new List<float>(); //in case distance > path length...
        const distances = <number[]>[];
        const accDistances = <number[]>[];
        let last = this.points[0];

        for (let i = 1; i <= this.points.length; i++) {
            let current: EPoint;
            if (i === this.points.length) {
                current = this.points[0];
            } else {
                current = this.points[i];
            }
            const diff = current.subtractReturn(last);
            const len = diff.length;
            distances.push(len);
            accDistances.push(len + accDistances.length === 0 ? 0 : accDistances[accDistances.length - 1]);
            if (distanceFromStart < len) {
                diff.length = distanceFromStart;
                return last.addReturn(diff);
            }
            distanceFromStart -= len;
            last = current;
        }
        const totalDistance = accDistances[accDistances.length - 1]; // distances.reduce((p, c) => p + c);
        const numClocked = distanceFromStart / totalDistance;
        const fract = numClocked - Math.floor(numClocked);
        const tmp = fract * totalDistance;
        for (let i = 0; i < accDistances.length; i++) {
            if (accDistances[i] < tmp) {
                const len = tmp - accDistances[i];
                const diff = this.points[i + 1].subtractReturn(this.points[i]);
                diff.length = len;
                return this.points[i].addReturn(diff);
            }
        }
        return last;
    }

    public reverseOrder() {
        this.points = this.points.reverse();
    }
}
