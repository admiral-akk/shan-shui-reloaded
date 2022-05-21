import { div } from "./Div";
import { PerlinNoise } from "./PerlinNoise";
import { Point } from "./Point";
import { stroke } from "./Stroke";
import { distance, poly, normRand, bezmh } from "./Utils";
import { PolyTools } from "./PolyTools";

export class Man {

    constructor(private Noise: PerlinNoise, private PolyTools: PolyTools) { }
    expand(ptlist: Point[], wfun: (x: number) => number) {
        let vtxlist0: Point[] = [];
        let vtxlist1: Point[] = [];
        let vtxlist: Point[] = [];
        var n0 = Math.random() * 10;
        for (var i = 1; i < ptlist.length - 1; i++) {
            var w = wfun(i / ptlist.length);
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
        var l = ptlist.length - 1;
        var a0 =
            Math.atan2(ptlist[1][1] - ptlist[0][1], ptlist[1][0] - ptlist[0][0]) -
            Math.PI / 2;
        var a1 =
            Math.atan2(
                ptlist[l][1] - ptlist[l - 1][1],
                ptlist[l][0] - ptlist[l - 1][0],
            ) -
            Math.PI / 2;
        var w0 = wfun(0);
        var w1 = wfun(1);
        vtxlist0.unshift([
            ptlist[0][0] + w0 * Math.cos(a0),
            ptlist[0][1] + w0 * Math.sin(a0),
        ]);
        vtxlist1.unshift([
            ptlist[0][0] - w0 * Math.cos(a0),
            ptlist[0][1] - w0 * Math.sin(a0),
        ]);
        vtxlist0.push([
            ptlist[l][0] + w1 * Math.cos(a1),
            ptlist[l][1] + w1 * Math.sin(a1),
        ]);
        vtxlist1.push([
            ptlist[l][0] - w1 * Math.cos(a1),
            ptlist[l][1] - w1 * Math.sin(a1),
        ]);
        return [vtxlist0, vtxlist1];
    };

    tranpoly(p0: Point, p1: Point, ptlist: Point[]) {
        var plist = ptlist.map(function (v) {
            return [-v[0], v[1]];
        });
        var ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) - Math.PI / 2;
        var scl = distance(p0, p1);
        var qlist = plist.map(function (v) {
            var d = distance(v, [0, 0]);
            var a = Math.atan2(v[1], v[0]);
            return [
                p0[0] + d * scl * Math.cos(ang + a),
                p0[1] + d * scl * Math.sin(ang + a),
            ];
        });
        return qlist;
    };

    flipper(plist: Point[]) {
        return plist.map(function (v) {
            return [-v[0], v[1]];
        });
    };

    hat01(p0: Point, p1: Point, args: any) {
        var args = args != undefined ? args : {};
        var fli = args.fli != undefined ? args.fli : false;

        var canv = "";
        var seed = Math.random();
        var f = fli
            ? (plist: Point[]) => this.flipper(plist)
            : (plist: Point[]) => plist;
        //var plist = [[-0.5,0.5],[0.5,0.5],[0.5,1],[-0.5,2]]
        canv += poly(
            this.tranpoly(
                p0,
                p1,
                f([
                    [-0.3, 0.5],
                    [0.3, 0.8],
                    [0.2, 1],
                    [0, 1.1],
                    [-0.3, 1.15],
                    [-0.55, 1],
                    [-0.65, 0.5],
                ]),
            ),
            { fil: "rgba(100,100,100,0.8)" },
        );

        var qlist1 = [];
        for (var i = 0; i < 10; i++) {
            qlist1.push([
                -0.3 - this.Noise.noise(i * 0.2, seed) * i * 0.1,
                0.5 - i * 0.3,
            ]);
        }
        canv += poly(this.tranpoly(p0, p1, f(qlist1)), {
            str: "rgba(100,100,100,0.8)",
            wid: 1,
        });

        return canv;
    };

    hat02(p0: Point, p1: Point, args: any) {
        var args = args != undefined ? args : {};
        var fli = args.fli != undefined ? args.fli : false;

        var canv = "";
        var seed = Math.random();

        var f = fli
            ? (plist: Point[]) => this.flipper(plist)
            : (plist: Point[]) => plist;
        // canv += poly(tranpoly(p0,p1,[
        //   [-0.3,0.6],[-0.15,1.0],[0,1.1],[0.15,1.0],[0.3,0.6]
        //   ]),{fil:"white",str:"rgba(130,130,130,0.8)",wid:1})
        canv += poly(
            this.tranpoly(
                p0,
                p1,
                f([
                    [-0.3, 0.5],
                    [-1.1, 0.5],
                    [-1.2, 0.6],
                    [-1.1, 0.7],
                    [-0.3, 0.8],
                    [0.3, 0.8],
                    [1.0, 0.7],
                    [1.3, 0.6],
                    [1.2, 0.5],
                    [0.3, 0.5],
                ]),
            ),
            { fil: "rgba(100,100,100,0.8)" },
        );
        return canv;
    };

    stick01(p0: Point, p1: Point, args: any) {
        var args = args != undefined ? args : {};
        var fli = args.fli != undefined ? args.fli : false;

        var canv = "";
        var seed = Math.random();
        var f = fli
            ? (plist: Point[]) => this.flipper(plist)
            : (plist: Point[]) => plist;

        var qlist1 = [];
        var l = 12;
        for (var i = 0; i < l; i++) {
            qlist1.push([
                -this.Noise.noise(i * 0.1, seed) * 0.1 * Math.sin((i / l) * Math.PI) * 5,
                0 + i * 0.3,
            ]);
        }
        canv += poly(this.tranpoly(p0, p1, f(qlist1)), {
            str: "rgba(100,100,100,0.5)",
            wid: 1,
        });

        return canv;
    };

    //      2
    //    1/
    // 7/  | \_ 6
    // 8| 0 \ 5
    //      /3
    //     4

    man(xoff: number, yoff: number, args: any) {
        var args = args != undefined ? args : {};
        var sca = args.sca != undefined ? args.sca : 0.5;
        var hat = args.hat != undefined ? args.hat : (p0: Point, p1: Point, args: any) => this.hat01(p0, p1, args);
        var ite =
            args.ite != undefined
                ? args.ite
                : function () {
                    return "";
                };
        var fli = args.fli != undefined ? args.fli : true;
        var ang =
            args.ang != undefined
                ? args.ang
                : [
                    0,
                    -Math.PI / 2,
                    normRand(0, 0),
                    (Math.PI / 4) * Math.random(),
                    ((Math.PI * 3) / 4) * Math.random(),
                    (Math.PI * 3) / 4,
                    -Math.PI / 4,
                    (-Math.PI * 3) / 4 - (Math.PI / 4) * Math.random(),
                    -Math.PI / 4,
                ];
        var len =
            args.len != undefined ? args.len : [0, 30, 20, 30, 30, 30, 30, 30, 30];

        len = len.map((v: number) => {
            return v * sca;
        });
        var canv = "";
        var sct = {
            0: { 1: { 2: {}, 5: { 6: {} }, 7: { 8: {} } }, 3: { 4: {} } },
        };
        var toGlobal = (v: Point) => {
            return [(fli ? -1 : 1) * v[0] + xoff, v[1] + yoff];
        };

        function gpar(sct: any, ind: number): number[] | undefined {
            var keys = Object.keys(sct);
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] === ind.toString()) {
                    return [ind];
                } else {
                    var r = gpar(sct[keys[i]], ind);
                    if (r) {
                        return [parseFloat(keys[i])].concat(r);
                    }
                }
            }
            return undefined;
        }
        function grot(sct: any, ind: number): number {
            var par = gpar(sct, ind) as number[];
            var rot = 0;
            for (var i = 0; i < par.length; i++) {
                rot += ang[par[i]];
            }
            return rot;
        }
        function gpos(sct: any, ind: number): Point {
            var par = gpar(sct, ind) as number[];
            var pos = [0, 0];
            for (var i = 0; i < par.length; i++) {
                var a = grot(sct, par[i]);
                pos[0] += len[par[i]] * Math.cos(a);
                pos[1] += len[par[i]] * Math.sin(a);
            }
            return pos;
        }

        var pts: Point[] = [];
        for (var i = 0; i < ang.length; i++) {
            pts.push(gpos(sct, i));
        }
        yoff -= pts[4][1];

        for (var i = 1; i < pts.length; i++) {
            var par = gpar(sct, i) as number[];
            var p0 = gpos(sct, par[par.length - 2]);
            var s = div([p0, pts[i]], 10);
            //canv += stroke(s.map(toGlobal))
        }

        var cloth = (plist: Point[], fun: (x: number) => number) => {
            var canv = "";
            var tlist = bezmh(this.PolyTools, plist, 2);
            var [tlist1, tlist2] = this.expand(tlist, fun);
            canv += poly(tlist1.concat(tlist2.reverse()).map(toGlobal), {
                fil: "white",
            });
            canv += stroke(tlist1.map(toGlobal), {
                wid: 1,
                col: "rgba(100,100,100,0.5)",
            }, this.Noise);
            canv += stroke(tlist2.map(toGlobal), {
                wid: 1,
                col: "rgba(100,100,100,0.6)",
            }, this.Noise);

            return canv;
        };

        var fsleeve = (x: number) => {
            return (
                sca *
                8 *
                (Math.sin(0.5 * x * Math.PI) * Math.pow(Math.sin(x * Math.PI), 0.1) +
                    (1 - x) * 0.4)
            );
        };
        var fbody = (x: number) => {
            return (
                sca *
                11 *
                (Math.sin(0.5 * x * Math.PI) * Math.pow(Math.sin(x * Math.PI), 0.1) +
                    (1 - x) * 0.5)
            );
        };
        var fhead = (x: number) => {
            return sca * 7 * Math.pow(0.25 - Math.pow(x - 0.5, 2), 0.3);
        };

        canv += ite(toGlobal(pts[8]), toGlobal(pts[6]), { fli: fli });

        canv += cloth([pts[1], pts[7], pts[8]], fsleeve);
        canv += cloth([pts[1], pts[0], pts[3], pts[4]], fbody);
        canv += cloth([pts[1], pts[5], pts[6]], fsleeve);
        canv += cloth([pts[1], pts[2]], fhead);

        var hlist = bezmh(this.PolyTools, [pts[1], pts[2]], 2);
        var [hlist1, hlist2] = this.expand(hlist, fhead);
        hlist1.splice(0, Math.floor(hlist1.length * 0.1));
        hlist2.splice(0, Math.floor(hlist2.length * 0.95));
        canv += poly(hlist1.concat(hlist2.reverse()).map(toGlobal), {
            fil: "rgba(100,100,100,0.6)",
        });

        canv += hat(toGlobal(pts[1]), toGlobal(pts[2]), { fli: fli });

        return canv;
    };

}