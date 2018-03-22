import { GraphicsEx } from './graphicsex';

export abstract class GfxCmd {
    public abstract execute(gfx: GraphicsEx): void;
    public abstract parse(cmdStr: string): string;
    public abstract get commandLetter(): string;
    public abstract toString(): string;

    public divide(t: number): any[] {
        return [];
    }
    // TODO: public abstract applyTransform(m: Matrix);

    public abstract copy(): GfxCmd;
}
