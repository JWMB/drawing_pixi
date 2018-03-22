import { GraphicsEx } from './../graphicsex';
import { GfxCmd } from './../gfxcmd';

// export namespace GfxCommands {

export class BeginFill extends GfxCmd {
    public color: number;
    public alpha: number;

    public constructor(colorVal: number = 0, alphaVal: number = 1) {
        super();
        this.color = colorVal;
        this.alpha = alphaVal;
    }
    // override
    public execute(gfx: GraphicsEx): void {
        // gfx.graphics.beginBitmapFill(bitmapData, matrix, repeat:Boolean, smooth:Boolean)
        // gfx.graphics.beginGradientFill(typeString, colors:Array, alphas:Array, ratios:Array, matrix,
        // spreadMethodString, interpolationMethodString, focalPointRatioNumner)
        if (this.alpha <= 0) {
            gfx.graphics.endFill();
        } else {
            gfx.graphics.beginFill(this.color, this.alpha);
        }
    }
    // override
    public parse(cmdStr: string): string {
        //// is it SVG or XAML?
        // var dict:EDictionary = EDictionary.parseString(cmdStr);
        //// race(dict.toString());

        // var val:String;
        // val = dict.getByKeyDefault("fill", "") as String;
        // if (val == "none")
        // 	return "";
        // if (val.length > 0) this.color = uint("0x" + val.substr(1));
        //// if (val.length > 0) race("clr: " + uint(val) + " " + val);

        // val = dict.getByKeyDefault("fill-opacity", "") as String;
        // if (val.length > 0) this.alpha = Number(val);
        //// style="fill-rule:nonzero;"

        return cmdStr;
    }
    // override
    public get commandLetter(): string {
        return '';
    }
    // override
    public toString(): string {
        return ''; // this.commandLetter + " " + this.point;
    }
    // override
    public copy(): GfxCmd {
        return new BeginFill(this.color, this.alpha);
    }
}
// }
