import { Point } from "./Point";


export function div(plist: Point[], reso: number): Point[] {
    var tl = (plist.length - 1) * reso;
    var lx = 0;
    var ly = 0;
    var rlist = [];

    for (var i = 0; i < tl; i += 1) {
        var lastp = plist[Math.floor(i / reso)];
        var nextp = plist[Math.ceil(i / reso)];
        var p = (i % reso) / reso;
        var nx = lastp[0] * (1 - p) + nextp[0] * p;
        var ny = lastp[1] * (1 - p) + nextp[1] * p;

        var ang = Math.atan2(ny - ly, nx - lx);

        rlist.push([nx, ny]);
        lx = nx;
        ly = ny;
    }

    if (plist.length > 0) {
        rlist.push(plist[plist.length - 1]);
    }
    return rlist;
}