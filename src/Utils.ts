import { Point } from "./Point";
import { PolyTools } from "./PolyTools";

export function unNan(plist: any): any {
    if (typeof plist != "object" || plist == null) {
        return plist || 0;
    } else {
        return plist.map(unNan);
    }
}
//console.log(unNan([[undefined,[NaN,NaN],null],false,1]))

export function distance(p0: Point, p1: Point): number {
    return Math.sqrt(Math.pow(p0[0] - p1[0], 2) + Math.pow(p0[1] - p1[1], 2));
}

export function mapval(value: number, istart: number, istop: number, ostart: number, ostop: number) {
    return (
        ostart + (ostop - ostart) * (((value - istart) * 1.0) / (istop - istart))
    );
}
export function loopNoise(noiseList: number[]) {
    var dif = noiseList[noiseList.length - 1] - noiseList[0];
    var bounds = [100, -100];
    for (var i = 0; i < noiseList.length; i++) {
        noiseList[i] += (dif * (noiseList.length - 1 - i)) / (noiseList.length - 1);
        if (noiseList[i] < bounds[0]) bounds[0] = noiseList[i];
        if (noiseList[i] > bounds[1]) bounds[1] = noiseList[i];
    }
    for (var i = 0; i < noiseList.length; i++) {
        noiseList[i] = mapval(noiseList[i], bounds[0], bounds[1], 0, 1);
    }
}

export function randChoice(arr: any[]): any {
    return arr[Math.floor(arr.length * Math.random())];
}

export function normRand(m: number, M: number): number {
    return mapval(Math.random(), 0, 1, m, M);
}

export function wtrand(weightFunction: (val: number) => number): number {
    var x = Math.random();
    var y = Math.random();
    if (y < weightFunction(x)) {
        return x;
    } else {
        return wtrand(weightFunction);
    }
}

export function randGaussian(): number {
    return (
        wtrand(function (x) {
            return Math.pow(Math.E, -24 * Math.pow(x - 0.5, 2));
        }) *
        2 -
        1
    );
}

export function bezmh(polyTool: PolyTools, P: Point[], w?: number) {
    w = w == undefined ? 1 : w;
    if (P.length == 2) {
        P = [P[0], polyTool.midPt([P[0], P[1]]), P[1]];
    }
    var plist = [];
    for (var j = 0; j < P.length - 2; j++) {
        var p0;
        var p1;
        var p2;
        if (j == 0) {
            p0 = P[j];
        } else {
            p0 = polyTool.midPt([P[j], P[j + 1]]);
        }
        p1 = P[j + 1];
        if (j == P.length - 3) {
            p2 = P[j + 2];
        } else {
            p2 = polyTool.midPt([P[j + 1], P[j + 2]]);
        }
        var pl = 20;
        for (var i = 0; i < pl + ((j == P.length - 3) ? 1 : 0); i += 1) {
            var t = i / pl;
            var u = Math.pow(1 - t, 2) + 2 * t * (1 - t) * w + t * t;
            plist.push([
                (Math.pow(1 - t, 2) * p0[0] +
                    2 * t * (1 - t) * p1[0] * w +
                    t * t * p2[0]) /
                u,
                (Math.pow(1 - t, 2) * p0[1] +
                    2 * t * (1 - t) * p1[1] * w +
                    t * t * p2[1]) /
                u,
            ]);
        }
    }
    return plist;
}

export function poly(plist: Point[], args: any): string {
    var args = args != undefined ? args : {};
    var xof = args.xof != undefined ? args.xof : 0;
    var yof = args.yof != undefined ? args.yof : 0;
    var fil = args.fil != undefined ? args.fil : "rgba(0,0,0,0)";
    var str = args.str != undefined ? args.str : fil;
    var wid = args.wid != undefined ? args.wid : 0;

    var canv = "<polyline points='";
    for (var i = 0; i < plist.length; i++) {
        canv +=
            " " +
            (plist[i][0] + xof).toFixed(1) +
            "," +
            (plist[i][1] + yof).toFixed(1);
    }
    canv +=
        "' style='fill:" +
        fil +
        ";stroke:" +
        str +
        ";stroke-width:" +
        wid +
        "'/>";
    return canv;
}