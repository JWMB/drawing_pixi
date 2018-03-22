import { GraphicsEx } from './../graphicsex';
import { EPoint } from '@jwmb/geometry';
import { GfxCmd } from './../gfxcmd';

// export namespace GfxCommands {

    export class LineTo extends GfxCmd {
        public point: EPoint;
        private _h: boolean;
        private _v: boolean;
        public constructor(p: number | EPoint = null, y: number = 0) {
            super();
            if (p == null) {
                this.point = new EPoint(0, 0);
            } else if (typeof p === 'object' && p.constructor === EPoint) {
                this.point = <EPoint>p;
            } else if (typeof p === 'number') {
                this.point = new EPoint(<number><any>p, y);
            } else {
                this.point = new EPoint(0, 0);
            }
        }

        public set x(val: number) {
            if (this.point == null) {
                this.point = new EPoint(val, 0);
            } else {
                this.point.x = val;
            }
        }
        public set y(val: number) {
            if (this.point == null) {
                this.point = new EPoint(0, val);
            } else {
                this.point.y = val;
            }
        }

        // override
        public execute(gfx: GraphicsEx) {
            if (this._v) {
                gfx.lineTo(gfx.turtle.x, this.point.y);
            } else if (this._h) {
                gfx.lineTo(this.point.y, gfx.turtle.y);
            } else {
                gfx.lineTo(this.point.x, this.point.y);
            }
        }

        // override
        public parse(cmdStr: string): string {
            let index = cmdStr.indexOf(' ', 2);
            if (index < 0) {
                index = cmdStr.length;
            }
            const val = cmdStr.substr(2, index - 1);
            if (cmdStr.charAt(0) === 'L') {
                this.point = EPoint.parse(val.replace(',', ';'));
            } else {
                const v = parseFloat(val);
                if (cmdStr.charAt(0) === 'V') {
                    this._v = true;
                    this.point = new EPoint(0, v);
                } else {
                    this._h = true;
                    this.point = new EPoint(v, 0);
                }
            }
            if (index < 0) {
                return '';
            }
            return cmdStr.substr(index + 1);
        }

        // override
        public get commandLetter(): string {
            if (this._v) {
                return 'V';
            }
            if (this._h) {
                return 'H';
            }
            return 'L';
        }

        // override
        public toString(): string {
            return this.commandLetter + ' ' + this.point;
        }

        // TODO:
        // override
        // public applyTransform(m:Matrix):void {
        // 	this.point = EPoint.fromPoint(m.transformPoint(this.point.toPoint()));
        // }
        // override
        public copy(): GfxCmd {
            return new LineTo(this.point);
        }
}
// }
