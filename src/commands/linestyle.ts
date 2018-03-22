import { GraphicsEx } from './../graphicsex';
import { GfxCmd } from './../gfxcmd';

// export namespace GfxCommands {

export class LineStyle extends GfxCmd {
    public thickness: number; // = 1;
    public color: number;
    public alpha: number; // = 1;
    public pixelHinting: boolean;
    public scaleMode: string; // = "normal";

    public constructor(thicknessVal: number = NaN, colorVal: number = 0, alphaVal: number = 1, pixelHintingVal: boolean = false,
        scaleModeVal: string = 'normal') {
        super();
        this.thickness = thicknessVal;
        this.color = colorVal;
        this.alpha = alphaVal;
        this.pixelHinting = pixelHintingVal;
        this.scaleMode = scaleModeVal;
    }
    // override
    public execute(gfx: GraphicsEx) {
        gfx.graphics.lineStyle(this.thickness, this.color, this.alpha);
        // , pixelHinting, scaleMode); // , caps:String, joints:String, miterLimit = 3)
    }
    // override
    public parse(cmdStr: string): string {
        return '';
        // TODO:
        //// is it SVG or XAML?
        // var dict:EDictionary = EDictionary.parseString(cmdStr);
        //// race(dict.toString());

        // var val:String;
        // val = dict.getByKeyDefault("stroke", "") as String;
        // if (val == "none")
        // 	return null;
        // if (val.length > 0) this.color = uint("0x" + val.substr(1)); //uint(val);

        // val = dict.getByKeyDefault("stroke-width", "") as String;
        // if (val.length > 0) this.thickness = Number(val);

        // val = dict.getByKeyDefault("stroke-opacity", "") as String;
        // if (val.length > 0) this.alpha = Number(val);

        // val = dict.getByKeyDefault("stroke-linecap", "") as String; //butt
        //// if (val.length > 0) this.color = uint(val);
        // val = dict.getByKeyDefault("stroke-linejoin", "") as String; //miter
        // val = dict.getByKeyDefault("stroke-miterlimit", "") as String; //Number or int?
        // val = dict.getByKeyDefault("stroke-dasharray", "") as String; //none

        // return cmdStr;
    }
    // override
    public get commandLetter(): string {
        return '';
    }
    // override
    public toString(): string {
        return 'LS' + this.color; // this.commandLetter + " " + this.point;
    }
    public copy(): GfxCmd {
        return new LineStyle(this.thickness, this.color, this.alpha, this.pixelHinting, this.scaleMode);
    }
}
// }
