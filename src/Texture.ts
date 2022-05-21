import { PerlinNoise } from "./PerlinNoise";
import { Point } from "./Point";
import { stroke } from "./Stroke";

export function texture(ptlist: Point[][], args: any, noise: PerlinNoise): Point[][] | string {
    var args = args != undefined ? args : {};
    var xof = args.xof != undefined ? args.xof : 0;
    var yof = args.yof != undefined ? args.yof : 0;
    var tex = args.tex != undefined ? args.tex : 400;
    var wid = args.wid != undefined ? args.wid : 1.5;
    var len = args.len != undefined ? args.len : 0.2;
    var sha = args.sha != undefined ? args.sha : 0;
    var ret = args.ret != undefined ? args.ret : 0;
    var noi =
        args.noi != undefined
            ? args.noi
            : function (x: number) {
                return 30 / x;
            };
    var col =
        args.col != undefined
            ? args.col
            : function (x: number) {
                return "rgba(100,100,100," + (Math.random() * 0.3).toFixed(3) + ")";
            };
    var dis =
        args.dis != undefined
            ? args.dis
            : function () {
                if (Math.random() > 0.5) {
                    return (1 / 3) * Math.random();
                } else {
                    return (1 * 2) / 3 + (1 / 3) * Math.random();
                }
            };
    var reso = [ptlist.length, ptlist[0].length];
    var texlist: Point[][] = [];
    for (var i = 0; i < tex; i++) {
        var mid = (dis() * reso[1]) | 0;
        //mid = (reso[1]/3+reso[1]/3*Math.random())|0

        var hlen = Math.floor(Math.random() * (reso[1] * len));

        var start = mid - hlen;
        var end = mid + hlen;
        start = Math.min(Math.max(start, 0), reso[1]);
        end = Math.min(Math.max(end, 0), reso[1]);

        var layer = (i / tex) * (reso[0] - 1);

        texlist.push([]);
        for (var j: number = start; j < end; j++) {
            var p = layer - Math.floor(layer);

            var x: number =
                ptlist[Math.floor(layer)][j][0] * p +
                ptlist[Math.ceil(layer)][j][0] * (1 - p);

            var y: number =
                ptlist[Math.floor(layer)][j][1] * p +
                ptlist[Math.ceil(layer)][j][1] * (1 - p);

            var ns: Point = [
                noi(layer + 1) * (noise.noise(x, j * 0.5) - 0.5),
                noi(layer + 1) * (noise.noise(y, j * 0.5) - 0.5),
            ];

            texlist[texlist.length - 1].push([x + ns[0], y + ns[1]]);
        }
    }
    var canv = "";
    //SHADE
    if (sha) {
        for (var j: number = 0; j < texlist.length; j += 1 + ((sha != 0) ? 1 : 0)) {
            canv += stroke(
                texlist[j].map(function (x) {
                    return [x[0] + xof, x[1] + yof];
                }),
                { col: "rgba(100,100,100,0.1)", wid: sha }, noise
            );
        }
    }
    //TEXTURE
    for (var j: number = 0 + sha; j < texlist.length; j += 1 + sha) {
        canv += stroke(
            texlist[j].map(function (x) {
                return [x[0] + xof, x[1] + yof];
            }),
            { col: col(j / texlist.length), wid: wid }, noise
        );
    }
    return ret ? texlist : canv;
};
