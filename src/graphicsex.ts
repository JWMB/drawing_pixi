// import { CurveTo } from './commands/curveto';
// import { LineTo } from './commands/lineto';
// import { MoveTo } from './commands/moveto';
import { EPoint } from '@jwmb/geometry';
import { Shape } from './shape';
import { GfxCmd } from './gfxcmd';
import { MoveTo, CurveTo, LineTo } from './commands/index';
import * as PIXI from 'pixi.js';

export class GraphicsEx {
    public turtle = new EPoint(0, 0);
    public constructor(public graphics: PIXI.Graphics) {
    }

    // public moveToPoint(p: EPoint) {
    // 	this.graphics.moveTo(p.x, p.y);
    // 	this.turtle.x = p.x;
    // 	this.turtle.y = p.y;
    // }
    public moveTo(x: number, y: number): void {
        this.graphics.moveTo(x, y);
        this.turtle.x = x;
        this.turtle.y = y;
    }
    // public lineToPoint(p: EPoint) {
    // 	this.graphics.lineTo(p.x, p.y);
    // 	this.turtle.x = p.x;
    // 	this.turtle.y = p.y;
    // }
    public lineTo(x: number, y: number) {
        this.graphics.lineTo(x, y);
        this.turtle.x = x;
        this.turtle.y = y;
    }
    // public curveToPoint(control: EPoint, anchor: EPoint) {
    //     this.graphics.quadraticCurveTo(control.x, control.y, anchor.x, anchor.y);
    // 	this.turtle.x = anchor.x;
    // 	this.turtle.y = anchor.y;
    // }
    public curveTo(ctrlX: number, ctrlY: number, anchorX: number, anchorY: number) {
        this.graphics.quadraticCurveTo(ctrlX, ctrlY, anchorX, anchorY);
        // a.push(new EPoint(ctrlX, ctrlY));
        // a.push(new EPoint(anchorX, anchorY));
        this.turtle.x = anchorX;
        this.turtle.y = anchorY;
    }
    public drawEllipse(x: number, y: number, w: number, h: number) {
        this.graphics.drawEllipse(x, y, w, h);
        // Turtle?!
    }

    public clear() {
        this.graphics.clear();
    }

    // private static a: any[];
    public executeCommands(commands: any[]): void {
        commands.forEach(obj => {
            // race("Exe: " + obj);
            if (!obj) {

            } else if (obj instanceof GfxCmd) {
                // onsole.log('exec cmd ', obj);
                (<GfxCmd>obj).execute(this);
            } else if (obj instanceof Shape) {
                // onsole.log('exec shape ', obj); //, GraphicsEx.createCommands(<Shape>obj));
                this.executeCommands(GraphicsEx.createCommands(<Shape>obj));
            } else if (obj.constructor === Array) {
                // onsole.log('exec array ', obj);
                this.executeCommands(<any[]>obj);
            } else {
                // race("Unknown command: " + obj);
            }
        });
    }
    public drawShapes(shapeOrShapes: Object): void {
        const cmds = GraphicsEx.createCommands(shapeOrShapes);
        this.executeCommands(cmds);
    }
    public static createCommands(shapesOrShape: Object, turtle: EPoint = null): any[] {
        // Shape | Shape[] | GfxCmd[]
        let shapes: Array<Shape | GfxCmd> = [];
        if (shapesOrShape instanceof Shape) {
            shapes.push(<Shape>shapesOrShape);
        } else {
            shapes = <Array<Shape | GfxCmd>>shapesOrShape;
        }

        const result: GfxCmd[] = [];
        shapes.forEach(obj => {
            if (obj instanceof Shape) {
                const shape = <Shape>obj;
                if (turtle == null || (shape.startPoint !== turtle && !(shape.startPoint.x === turtle.x
                    && shape.startPoint.y === turtle.y))) {
                    result.push(new MoveTo(shape.startPoint));
                }
                const gfxCmd: Object = shape.createGfxCmd();
                GraphicsEx.flatten(gfxCmd, result);
                turtle = shape.endPoint;
            } else if (obj instanceof GfxCmd) {
                result.push(obj);
            }
        });
        return result;
    }

    private static flatten(cmdOrArray: Object, flattened: any[]): void {
        if (cmdOrArray !== null) {
            if (typeof cmdOrArray === 'object' && cmdOrArray.constructor === Array) {
                (<any[]>cmdOrArray).forEach(_ => GraphicsEx.flatten(_, flattened));
            } else {
                flattened.push(cmdOrArray);
            }
        }
    }


    public static parseCommands(cmdStr: string): GfxCmd[] {
        // Data="M 100,200 C 100,25 400,350 400,175 H 280" />
        const result = <GfxCmd[]>[];
        while (true) {
            let c = cmdStr.charAt(0);
            if (c === ' ') {
                console.log('! ' + cmdStr);
                cmdStr = cmdStr.substr(1);
                continue;
            }
            let cmd: GfxCmd = null;
            if (c === 'M') { // TODO: if only AS3 had better reflection...
                cmd = new MoveTo();
            } else if (c === 'L' || c === 'V' || c === 'H') {
                cmd = new LineTo();
            } else if (c === 'C') {
                cmd = new CurveTo();
            } else {
                for (let i = 1; i < cmdStr.length; i++) {
                    c = cmdStr.charAt(i);
                    const code = cmdStr.charCodeAt(i);
                    if (!((code >= 48 && code <= 57) || c === ' ' || c === ',' || c === '.')) {
                        cmdStr = cmdStr.substr(i);
                        break;
                    }
                }
            }
            if (cmd != null) {
                cmdStr = cmd.parse(cmdStr);
                result.push(cmd);
            }
            if (cmdStr.length <= 2) {
                break;
            }
        }
        return result;
    }

    public static getCommandsString(cmds: GfxCmd[]): string {
        return cmds.map(_ => _.toString()).join(' ');
    }

}
