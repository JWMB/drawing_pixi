import { EPoint } from '@jwmb/geometry';
export abstract class Shape {
    public constructor() {
    }

    public abstract createGfxCmd(): any; // GfxCmd
    public abstract get startPoint(): EPoint;
    public abstract get endPoint(): EPoint;
    public abstract copy(): Shape;

    public abstract move(pt: EPoint): void;
    public createPrimitiveShapes(): any[] { // TODO: abstract ?
        throw Error('Not implemented');
    }
    // public draw(gfx: Graphics) {
    // var x = new GraphicsEx(gfx);
    // x.drawShapes(this);
    // }
}
