// import { BeginFill } from './../drawing/commands/beginfill';
// import { LineStyle } from './../drawing/commands/linestyle';
// // import { RoundRectangle } from './../drawing/roundrectangle';
// // import { NGon } from './../drawing/ngon';
// // import { Rectangle } from './../drawing/rectangle';
// // import { Ellipse } from './../drawing/ellipse';
// import { Line } from './../drawing/line';
// /// <reference path="../external/pixi.d.ts" />

// import { GraphicsEx } from './../drawing/graphicsex';
// import { ERectangle } from './../geometry/erectangle';
// import { EPoint } from './../geometry/epoint';

// export class Main {
//     constructor() {
//         //PIXI.autoDetectRenderer
//         let renderer = new PIXI.CanvasRenderer(256, 256, {antialias: false, transparent: false, resolution: 1});
//         document.body.appendChild(renderer.view);
//         renderer.backgroundColor = 0x061639;

//         let stage = new PIXI.Container();

//         renderer.autoResize = true;
//         renderer.resize(512, 512);

//         let gfx = new PIXI.Graphics();
//         stage.addChild(gfx);
//         //gfx.lineStyle(5, 0x0088ff).moveTo(0,0).lineTo(100,100);

//         let g = new GraphicsEx(gfx);

//         //let r = new RoundRectangle(new ERectangle(10,10,170,170), new EPoint(60, 30));
//         let l = new Line(new EPoint(0,0), new EPoint(100, 100));
//         ///let c = new Ellipse(new ERectangle(0,0,60,30));
//         // let n = new NGon(new EPoint(40, 40), 12, 20, [1, 0.5])

//         let fDraw = () => {
//             gfx.clear();
//             var cmds = <any[]>[new LineStyle(4, 0xffffff), new BeginFill(0xff0000, 0.5)];
//             //c.move(new EPoint(Math.random() * 2 - 1, Math.random() * 2 - 1));
//             // r.tension = (Date.now() % 2000) / 2000 * 2;
//             // n.radiiVariations[1] = ((Date.now() % 1000) / 1000) * 2;
//             // if (n.radiiVariations[1] > 1) { n.radiiVariations[1] = 2.0 - n.radiiVariations[1]; }
//             // cmds = cmds.concat([c, r, n]);
//             //cmds = cmds.concat([c, r]);
//             cmds.push(new BeginFill(0,-1));
//             cmds.push(new LineStyle(2, 0xbbbbff));
//             cmds.push(l);
//             cmds.filter(_ => _.constructor === LineStyle)
//                 .forEach(_ => (<LineStyle>_).alpha = ((Date.now() % 1500) / 1500));
//             g.drawShapes(cmds);
//         };
//         //fDraw();
//         this.registerUpdate(fDraw);

//         let lastTimestamp = Date.now();
//         let fStep = (timestamp) => {
//             let diff = timestamp - lastTimestamp;
//             lastTimestamp = timestamp;
//             this.updatesToCall.forEach(_ => _());
//             renderer.render(stage);
//             window.requestAnimationFrame(fStep);
//         };
//         window.requestAnimationFrame(fStep);
//     }

//     updatesToCall: Function[] = [];
//     registerUpdate(callback: Function) {
//         this.updatesToCall.push(callback);
//     }
// }
