import { PerlinNoise } from "./PerlinNoise";
import { Point } from "./Point";
import { poly } from "./Utils";

export function stroke(ptlist: Point[], args: any, noise: PerlinNoise): string {
    var args = args != undefined ? args : {};
    var xof = args.xof != undefined ? args.xof : 0;
    var yof = args.yof != undefined ? args.yof : 0;
    var wid = args.wid != undefined ? args.wid : 2;
    var col = args.col != undefined ? args.col : "rgba(200,200,200,0.9)";
    var noi = args.noi != undefined ? args.noi : 0.5;
    var out = args.out != undefined ? args.out : 1;
    var fun =
        args.fun != undefined
            ? args.fun
            : function (x: number) {
                return Math.sin(x * Math.PI);
            };

    if (ptlist.length == 0) {
        return "";
    }
    let vtxlist0: Point[] = [];
    let vtxlist1: Point[] = [];
    let vtxlist: Point[] = [];
    var n0 = Math.random() * 10;
    for (var i = 1; i < ptlist.length - 1; i++) {
        var w = wid * fun(i / ptlist.length);
        w = w * (1 - noi) + w * noi * noise.noise(i * 0.5, n0);
        var a1 = Math.atan2(
            ptlist[i][1] - ptlist[i - 1][1],
            ptlist[i][0] - ptlist[i - 1][0],
        );
        var a2 = Math.atan2(
            ptlist[i][1] - ptlist[i + 1][1],
            ptlist[i][0] - ptlist[i + 1][0],
        );
        var a = (a1 + a2) / 2;
        if (a < a2) {
            a += Math.PI;
        }
        vtxlist0.push([
            ptlist[i][0] + w * Math.cos(a),
            ptlist[i][1] + w * Math.sin(a),
        ]);
        vtxlist1.push([
            ptlist[i][0] - w * Math.cos(a),
            ptlist[i][1] - w * Math.sin(a),
        ]);
    }

    vtxlist = [ptlist[0]]
        .concat(
            vtxlist0.concat(vtxlist1.concat([ptlist[ptlist.length - 1]]).reverse()),
        )
        .concat([ptlist[0]]);

    var canv = poly(
        vtxlist.map(function (x) {
            return [x[0] + xof, x[1] + yof];
        }),
        { fil: col, str: col, wid: out },
    );
    return canv;
}