import { PerlinNoise } from "./PerlinNoise";
import { Point } from "./Point";
import { loopNoise, poly } from "./Utils";

export function blob(x: number, y: number, args: any, noise: PerlinNoise): string | Point[] {
    var args = args != undefined ? args : {};
    var len = args.len != undefined ? args.len : 20;
    var wid = args.wid != undefined ? args.wid : 5;
    var ang = args.ang != undefined ? args.ang : 0;
    var col = args.col != undefined ? args.col : "rgba(200,200,200,0.9)";
    var noi = args.noi != undefined ? args.noi : 0.5;
    var ret = args.ret != undefined ? args.ret : 0;
    var fun =
        args.fun != undefined
            ? args.fun
            : function (x: number) {
                return x <= 1
                    ? Math.pow(Math.sin(x * Math.PI), 0.5)
                    : -Math.pow(Math.sin((x + 1) * Math.PI), 0.5);
            };

    var reso = 20.0;
    var lalist = [];
    for (var i = 0; i < reso + 1; i++) {
        var p = (i / reso) * 2;
        var xo = len / 2 - Math.abs(p - 1) * len;
        var yo = (fun(p) * wid) / 2;
        var a = Math.atan2(yo, xo);
        var l = Math.sqrt(xo * xo + yo * yo);
        lalist.push([l, a]);
    }
    var nslist = [];
    var n0 = Math.random() * 10;
    for (var i = 0; i < reso + 1; i++) {
        nslist.push(noise.noise(i * 0.05, n0));
    }

    loopNoise(nslist);
    var plist = [];
    for (var i = 0; i < lalist.length; i++) {
        var ns = nslist[i] * noi + (1 - noi);
        var nx = x + Math.cos(lalist[i][1] + ang) * lalist[i][0] * ns;
        var ny = y + Math.sin(lalist[i][1] + ang) * lalist[i][0] * ns;
        plist.push([nx, ny]);
    }

    if (ret == 0) {
        return poly(plist, { fil: col, str: col, wid: 0 });
    } else {
        return plist;
    }
}