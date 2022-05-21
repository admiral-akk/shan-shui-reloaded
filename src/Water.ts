import { PerlinNoise } from "./PerlinNoise";
import { Point } from "./Point";
import { stroke } from "./Stroke";

export function water(xoff: number, yoff: number, seed: number, args: any, Noise: PerlinNoise): string {
    var args = args != undefined ? args : {};
    var hei = args.hei != undefined ? args.hei : 2;
    var len = args.len != undefined ? args.len : 800;
    var clu = args.clu != undefined ? args.clu : 10;
    var canv = "";

    var ptlist: Point[][] = [];
    var yk = 0;
    for (var i = 0; i < clu; i++) {
        ptlist.push([]);
        var xk = (Math.random() - 0.5) * (len / 8);
        yk += Math.random() * 5;
        var lk = len / 4 + Math.random() * (len / 4);
        var reso = 5;
        for (var j = -lk; j < lk; j += reso) {
            ptlist[ptlist.length - 1].push([
                j + xk,
                Math.sin(j * 0.2) * hei * Noise.noise(j * 0.1) - 20 + yk,
            ]);
        }
    }

    for (var j = 1; j < ptlist.length; j += 1) {
        canv += stroke(
            ptlist[j].map(function (x) {
                return [x[0] + xoff, x[1] + yoff];
            }),
            {
                col:
                    "rgba(100,100,100," + (0.3 + Math.random() * 0.3).toFixed(3) + ")",
                wid: 1,
            },
            Noise
        );
    }

    return canv;
}