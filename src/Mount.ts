import { div } from "./Div";
import { PerlinNoise } from "./PerlinNoise";
import { Point } from "./Point";
import { PolyTools } from "./PolyTools";
import { stroke } from "./Stroke";
import { texture } from "./Texture";
import { Tree } from "./Tree";
import { loopNoise, normRand, poly, randChoice } from "./Utils";

export class Mount {
    constructor(private Noise: PerlinNoise, private Tree: Tree, private Arch: Arch, private PolyTools: PolyTools) { }
    foot(ptlist: Point[][], args: any): Point[][] | string {
        var args = args != undefined ? args : {};
        var xof = args.xof != undefined ? args.xof : 0;
        var yof = args.yof != undefined ? args.yof : 0;
        var ret = args.ret != undefined ? args.ret : 0;

        var ftlist: Point[][] = [];
        var span = 10;
        var ni = 0;
        for (var i = 0; i < ptlist.length - 2; i += 1) {
            if (i == ni) {
                ni = Math.min(ni + randChoice([1, 2]), ptlist.length - 1);

                ftlist.push([]);
                ftlist.push([]);
                for (var j = 0; j < Math.min(ptlist[i].length / 8, 10); j++) {
                    ftlist[ftlist.length - 2].push([
                        ptlist[i][j][0] + this.Noise.noise(j * 0.1, i) * 10,
                        ptlist[i][j][1],
                    ]);
                    ftlist[ftlist.length - 1].push([
                        ptlist[i][ptlist[i].length - 1 - j][0] -
                        this.Noise.noise(j * 0.1, i) * 10,
                        ptlist[i][ptlist[i].length - 1 - j][1],
                    ]);
                }

                ftlist[ftlist.length - 2] = ftlist[ftlist.length - 2].reverse();
                ftlist[ftlist.length - 1] = ftlist[ftlist.length - 1].reverse();
                for (var j = 0; j < span; j++) {
                    var p = j / span;
                    var x1 = ptlist[i][0][0] * (1 - p) + ptlist[ni][0][0] * p;
                    var y1 = ptlist[i][0][1] * (1 - p) + ptlist[ni][0][1] * p;

                    var x2 =
                        ptlist[i][ptlist[i].length - 1][0] * (1 - p) +
                        ptlist[ni][ptlist[i].length - 1][0] * p;
                    var y2 =
                        ptlist[i][ptlist[i].length - 1][1] * (1 - p) +
                        ptlist[ni][ptlist[i].length - 1][1] * p;

                    var vib = -1.7 * (p - 1) * Math.pow(p, 1 / 5);
                    y1 += vib * 5 + this.Noise.noise(xof * 0.05, i) * 5;
                    y2 += vib * 5 + this.Noise.noise(xof * 0.05, i) * 5;

                    ftlist[ftlist.length - 2].push([x1, y1]);
                    ftlist[ftlist.length - 1].push([x2, y2]);
                }
            }
        }
        var canv = "";
        for (var i = 0; i < ftlist.length; i++) {
            canv += poly(ftlist[i], {
                xof: xof,
                yof: yof,
                fil: "white",
                str: "none",
            });
        }
        for (var j = 0; j < ftlist.length; j++) {
            canv += stroke(
                ftlist[j].map(function (x) {
                    return [x[0] + xof, x[1] + yof];
                }),
                {
                    col:
                        "rgba(100,100,100," +
                        (0.1 + Math.random() * 0.1).toFixed(3) +
                        ")",
                    wid: 1,
                },
                this.Noise
            );
        }
        return ret ? ftlist : canv;
    };

    private vegetate(treeFunc: (x: number, y: number) => string, growthRule: (i: number, j: number) => boolean, proofRule: (veglist: Point[], i: number) => boolean, ptlist: Point[][], canv: string) {
        var veglist = [];
        for (var i = 0; i < ptlist.length; i += 1) {
            for (var j = 0; j < ptlist[i].length; j += 1) {
                if (growthRule(i, j)) {
                    veglist.push([ptlist[i][j][0], ptlist[i][j][1]]);
                }
            }
        }
        for (var i = 0; i < veglist.length; i++) {
            if (proofRule(veglist, i)) {
                canv += treeFunc(veglist[i][0], veglist[i][1]);
            }
        }
    }

    mountain(xoff: number, yoff: number, seed: number, args: any) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 100 + Math.random() * 400;
        var wid = args.wid != undefined ? args.wid : 400 + Math.random() * 200;
        var tex = args.tex != undefined ? args.tex : 200;
        var veg = args.veg != undefined ? args.veg : true;
        var ret = args.ret != undefined ? args.ret : 0;
        var col = args.col != undefined ? args.col : undefined;

        seed = seed != undefined ? seed : 0;

        var canv = "";

        var ptlist: Point[][] = [];
        var h = hei;
        var w = wid;
        var reso = [10, 50];

        var hoff = 0;
        for (var j = 0; j < reso[0]; j++) {
            hoff += (Math.random() * yoff) / 100;
            ptlist.push([]);
            for (var i = 0; i < reso[1]; i++) {
                var x = (i / reso[1] - 0.5) * Math.PI;
                var y = Math.cos(x);
                y *= this.Noise.noise(x + 10, j * 0.15, seed);
                var p = 1 - j / reso[0];
                ptlist[ptlist.length - 1].push([
                    (x / Math.PI) * w * p,
                    -y * h * p + hoff,
                ]);
            }
        }
        //RIM
        this.vegetate(
            (x, y) => {
                return this.Tree.tree02(x + xoff, y + yoff - 5, {
                    col:
                        "rgba(100,100,100," +
                        (this.Noise.noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5).toFixed(3) +
                        ")",
                    clu: 2,
                });
            },
            (i, j) => {
                var ns = this.Noise.noise(j * 0.1, seed);
                return (
                    i == 0 && ns * ns * ns < 0.1 && Math.abs(ptlist[i][j][1]) / h > 0.2
                );
            },
            (veglist, i) => {
                return true;
            },
            ptlist, canv
        );

        //WHITE BG
        canv += poly(ptlist[0].concat([[0, reso[0] * 4]]), {
            xof: xoff,
            yof: yoff,
            fil: "white",
            str: "none",
        });
        //OUTLINE
        canv += stroke(
            ptlist[0].map(function (x) {
                return [x[0] + xoff, x[1] + yoff];
            }),
            { col: "rgba(100,100,100,0.3)", noi: 1, wid: 3 },
            this.Noise
        );

        canv += this.foot(ptlist, { xof: xoff, yof: yoff });
        canv += texture(ptlist, {
            xof: xoff,
            yof: yoff,
            tex: tex,
            sha: randChoice([0, 0, 0, 0, 5]),
            col: col,
        },
            this.Noise);

        //TOP
        this.vegetate(
            (x, y) => {
                return this.Tree.tree02(x + xoff, y + yoff, {
                    col:
                        "rgba(100,100,100," +
                        (this.Noise.noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5).toFixed(3) +
                        ")",
                });
            },
            (i, j) => {
                var ns = this.Noise.noise(i * 0.1, j * 0.1, seed + 2);
                return ns * ns * ns < 0.1 && Math.abs(ptlist[i][j][1]) / h > 0.5;
            },
            (veglist, i) => {
                return true;
            },
            ptlist, canv
        );

        if (veg) {
            //MIDDLE
            this.vegetate(
                (x, y) => {
                    var ht = ((h + y) / h) * 70;
                    ht = ht * 0.3 + Math.random() * ht * 0.7;
                    return this.Tree.tree01(x + xoff, y + yoff, {
                        hei: ht,
                        wid: Math.random() * 3 + 1,
                        col:
                            "rgba(100,100,100," +
                            (this.Noise.noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.3).toFixed(3) +
                            ")",
                    });
                },
                (i, j) => {
                    var ns = this.Noise.noise(i * 0.2, j * 0.05, seed);
                    return (
                        (j % 2 !== 0) &&
                        (ns * ns * ns * ns < 0.012) &&
                        (Math.abs(ptlist[i][j][1]) / h < 0.3)
                    );
                },
                (veglist, i) => {
                    var counter = 0;
                    for (var j = 0; j < veglist.length; j++) {
                        if (
                            i != j &&
                            Math.pow(veglist[i][0] - veglist[j][0], 2) +
                            Math.pow(veglist[i][1] - veglist[j][1], 2) <
                            30 * 30
                        ) {
                            counter++;
                        }
                        if (counter > 2) {
                            return true;
                        }
                    }
                    return false;
                },
                ptlist, canv
            );

            //BOTTOM
            this.vegetate(
                (x, y) => {
                    var ht = ((h + y) / h) * 120;
                    ht = ht * 0.5 + Math.random() * ht * 0.5;
                    var bc = Math.random() * 0.1;
                    var bp = 1;
                    return this.Tree.tree03(x + xoff, y + yoff, {
                        hei: ht,
                        ben: function (x) {
                            return Math.pow(x * bc, bp);
                        },
                        col:
                            "rgba(100,100,100," +
                            (this.Noise.noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.3).toFixed(3) +
                            ")",
                    });
                },
                (i, j) => {
                    var ns = this.Noise.noise(i * 0.2, j * 0.05, seed);
                    return (
                        (j == 0 || j == ptlist[i].length - 1) && ns * ns * ns * ns < 0.012
                    );
                },
                (veglist, i) => {
                    return true;
                },
                ptlist, canv
            );
        }

        //BOTT ARCH
        this.vegetate(
            (x, y) => {
                var tt = randChoice([0, 0, 1, 1, 1, 2]);
                if (tt == 1) {
                    return this.Arch.arch02(x + xoff, y + yoff, seed, {
                        wid: normRand(40, 70),
                        sto: randChoice([1, 2, 2, 3]),
                        rot: Math.random(),
                        sty: randChoice([1, 2, 3]),
                    });
                } else if (tt == 2) {
                    return this.Arch.arch04(x + xoff, y + yoff, seed, {
                        sto: randChoice([1, 1, 1, 2, 2]),
                    });
                } else {
                    return "";
                }
            },
            (i, j) => {
                var ns = this.Noise.noise(i * 0.2, j * 0.05, seed + 10);
                return (
                    i != 0 &&
                    (j == 1 || j == ptlist[i].length - 2) &&
                    ns * ns * ns * ns < 0.008
                );
            },
            (veglist, i) => {
                return true;
            },
            ptlist, canv
        );
        //TOP ARCH
        this.vegetate(
            (x, y) => {
                return this.Arch.arch03(x + xoff, y + yoff, seed, {
                    sto: randChoice([5, 7]),
                    wid: 40 + Math.random() * 20,
                });
            },
            (i, j) => {
                return (
                    i == 1 &&
                    Math.abs(j - ptlist[i].length / 2) < 1 &&
                    Math.random() < 0.02
                );
            },
            (veglist, i) => {
                return true;
            },
            ptlist, canv
        );

        //TRANSM
        this.vegetate(
            (x, y) => {
                return this.Arch.transmissionTower01(x + xoff, y + yoff, seed);
            },
            (i, j) => {
                var ns = this.Noise.noise(i * 0.2, j * 0.05, seed + 20 * Math.PI);
                return (
                    i % 2 == 0 &&
                    (j == 1 || j == ptlist[i].length - 2) &&
                    ns * ns * ns * ns < 0.002
                );
            },
            (veglist, i) => {
                return true;
            },
            ptlist, canv
        );

        //BOTT ROCK
        this.vegetate(
            (x, y) => {
                return this.rock(x + xoff, y + yoff, seed, {
                    wid: 20 + Math.random() * 20,
                    hei: 20 + Math.random() * 20,
                    sha: 2,
                });
            },
            (i, j) => {
                return (j == 0 || j == ptlist[i].length - 1) && Math.random() < 0.1;
            },
            (veglist, i) => {
                return true;
            },
            ptlist, canv
        );

        if (ret == 0) {
            return canv;
        } else {
            return [ptlist];
        }
    };

    flatMount(xoff: number, yoff: number, seed: number, args: any) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 40 + Math.random() * 400;
        var wid = args.wid != undefined ? args.wid : 400 + Math.random() * 200;
        var tex = args.tex != undefined ? args.tex : 80;
        var cho = args.cho != undefined ? args.cho : 0.5;
        var ret = args.ret != undefined ? args.ret : 0;

        seed = seed != undefined ? seed : 0;

        var canv = "";
        var ptlist: Point[][] = [];
        var reso = [5, 50];
        var hoff = 0;
        var flat: Point[][] = [];
        for (var j = 0; j < reso[0]; j++) {
            hoff += (Math.random() * yoff) / 100;
            ptlist.push([]);
            flat.push([]);
            for (var i = 0; i < reso[1]; i++) {
                var x = (i / reso[1] - 0.5) * Math.PI;
                var y = Math.cos(x * 2) + 1;
                y *= this.Noise.noise(x + 10, j * 0.1, seed);
                var p = 1 - (j / reso[0]) * 0.6;
                var nx = (x / Math.PI) * wid * p;
                var ny = -y * hei * p + hoff;
                var h = 100;
                if (ny < -h * cho + hoff) {
                    ny = -h * cho + hoff;
                    if (flat[flat.length - 1].length % 2 == 0) {
                        flat[flat.length - 1].push([nx, ny]);
                    }
                } else {
                    if (flat[flat.length - 1].length % 2 == 1) {
                        flat[flat.length - 1].push(
                            ptlist[ptlist.length - 1][ptlist[ptlist.length - 1].length - 1],
                        );
                    }
                }

                ptlist[ptlist.length - 1].push([nx, ny]);
            }
        }

        //WHITE BG
        canv += poly(ptlist[0].concat([[0, reso[0] * 4]]), {
            xof: xoff,
            yof: yoff,
            fil: "white",
            str: "none",
        });
        //OUTLINE
        canv += stroke(
            ptlist[0].map(function (x) {
                return [x[0] + xoff, x[1] + yoff];
            }),
            { col: "rgba(100,100,100,0.3)", noi: 1, wid: 3 },
            this.Noise
        );

        //canv += foot(ptlist,{xof:xoff,yof:yoff})
        canv += texture(ptlist, {
            xof: xoff,
            yof: yoff,
            tex: tex,
            wid: 2,
            dis: function () {
                if (Math.random() > 0.5) {
                    return 0.1 + 0.4 * Math.random();
                } else {
                    return 0.9 - 0.4 * Math.random();
                }
            },
        },
            this.Noise);
        var grlist1 = [];
        var grlist2 = [];
        for (var i = 0; i < flat.length; i += 2) {
            if (flat[i].length >= 2) {
                grlist1.push(flat[i][0]);
                grlist2.push(flat[i][flat[i].length - 1]);
            }
        }

        if (grlist1.length == 0) {
            return canv;
        }
        var wb = [grlist1[0][0], grlist2[0][0]];
        for (var i = 0; i < 3; i++) {
            var p = 0.8 - i * 0.2;

            grlist1.unshift([wb[0] * p, grlist1[0][1] - 5]);
            grlist2.unshift([wb[1] * p, grlist2[0][1] - 5]);
        }
        wb = [grlist1[grlist1.length - 1][0], grlist2[grlist2.length - 1][0]];
        for (var i = 0; i < 3; i++) {
            var p = 0.6 - i * i * 0.1;
            grlist1.push([wb[0] * p, grlist1[grlist1.length - 1][1] + 1]);
            grlist2.push([wb[1] * p, grlist2[grlist2.length - 1][1] + 1]);
        }

        var d = 5;
        grlist1 = div(grlist1, d);
        grlist2 = div(grlist2, d);

        var grlist = grlist1.reverse().concat(grlist2.concat([grlist1[0]]));
        for (var i = 0; i < grlist.length; i++) {
            var v = (1 - Math.abs((i % d) - d / 2) / (d / 2)) * 0.12;
            grlist[i][0] *= 1 - v + this.Noise.noise(grlist[i][1] * 0.5) * v;
        }
        /*       for (var i = 0; i < ptlist.length; i++){
          canv += poly(ptlist[i],{xof:xoff,yof:yoff,str:"red",fil:"none",wid:2})
        }
    */
        canv += poly(grlist, {
            xof: xoff,
            yof: yoff,
            str: "none",
            fil: "white",
            wid: 2,
        });
        canv += stroke(grlist.map(x => [x[0] + xoff, x[1] + yoff]), {
            wid: 3,
            col: "rgba(100,100,100,0.2)",
        }, this.Noise);

        canv += this.flatDec(xoff, yoff, this.bound(grlist));

        return canv;
    };

    private bound(plist: Point[]) {
        var xmin;
        var xmax;
        var ymin;
        var ymax;
        for (var i = 0; i < plist.length; i++) {
            if (xmin == undefined || plist[i][0] < xmin) {
                xmin = plist[i][0];
            }
            if (xmax == undefined || plist[i][0] > xmax) {
                xmax = plist[i][0];
            }
            if (ymin == undefined || plist[i][1] < ymin) {
                ymin = plist[i][1];
            }
            if (ymax == undefined || plist[i][1] > ymax) {
                ymax = plist[i][1];
            }
        }
        return { xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax };
    };

    flatDec(xoff: number, yoff: number, grbd: any): string {
        var canv = "";

        var tt = randChoice([0, 0, 1, 2, 3, 4]);

        for (var j = 0; j < Math.random() * 5; j++) {
            canv += this.rock(
                xoff + normRand(grbd.xmin, grbd.xmax),
                yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-10, 10) + 10,
                Math.random() * 100,
                {
                    wid: 10 + Math.random() * 20,
                    hei: 10 + Math.random() * 20,
                    sha: 2,
                },
            );
        }
        for (var j = 0; j < randChoice([0, 0, 1, 2]); j++) {
            var xr = xoff + normRand(grbd.xmin, grbd.xmax);
            var yr = yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-5, 5) + 20;
            for (var k = 0; k < 2 + Math.random() * 3; k++) {
                canv += this.Tree.tree08(
                    xr + Math.min(Math.max(normRand(-30, 30), grbd.xmin), grbd.xmax),
                    yr,
                    { hei: 60 + Math.random() * 40 },
                );
            }
        }

        if (tt == 0) {
            for (var j = 0; j < Math.random() * 3; j++) {
                canv += this.rock(
                    xoff + normRand(grbd.xmin, grbd.xmax),
                    yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-5, 5) + 20,
                    Math.random() * 100,
                    {
                        wid: 50 + Math.random() * 20,
                        hei: 40 + Math.random() * 20,
                        sha: 5,
                    },
                );
            }
        }
        if (tt == 1) {
            var pmin = Math.random() * 0.5;
            var pmax = Math.random() * 0.5 + 0.5;
            var xmin = grbd.xmin * (1 - pmin) + grbd.xmax * pmin;
            var xmax = grbd.xmin * (1 - pmax) + grbd.xmax * pmax;
            for (var i = xmin; i < xmax; i += 30) {
                canv += this.Tree.tree05(
                    xoff + i + 20 * normRand(-1, 1),
                    yoff + (grbd.ymin + grbd.ymax) / 2 + 20,
                    { hei: 100 + Math.random() * 200 },
                );
            }
            for (var j = 0; j < Math.random() * 4; j++) {
                canv += this.rock(
                    xoff + normRand(grbd.xmin, grbd.xmax),
                    yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-5, 5) + 20,
                    Math.random() * 100,
                    {
                        wid: 50 + Math.random() * 20,
                        hei: 40 + Math.random() * 20,
                        sha: 5,
                    },
                );
            }
        } else if (tt == 2) {
            for (var i = 0; i < randChoice([1, 1, 1, 1, 2, 2, 3]); i++) {
                var xr = normRand(grbd.xmin, grbd.xmax);
                var yr = (grbd.ymin + grbd.ymax) / 2;
                canv += this.Tree.tree04(xoff + xr, yoff + yr + 20, {});
                for (var j = 0; j < Math.random() * 2; j++) {
                    canv += this.rock(
                        xoff +
                        Math.max(
                            grbd.xmin,
                            Math.min(grbd.xmax, xr + normRand(-50, 50)),
                        ),
                        yoff + yr + normRand(-5, 5) + 20,
                        j * i * Math.random() * 100,
                        {
                            wid: 50 + Math.random() * 20,
                            hei: 40 + Math.random() * 20,
                            sha: 5,
                        },
                    );
                }
            }
        } else if (tt == 3) {
            for (var i = 0; i < randChoice([1, 1, 1, 1, 2, 2, 3]); i++) {
                canv += this.Tree.tree06(
                    xoff + normRand(grbd.xmin, grbd.xmax),
                    yoff + (grbd.ymin + grbd.ymax) / 2,
                    { hei: 60 + Math.random() * 60 },
                );
            }
        } else if (tt == 4) {
            var pmin = Math.random() * 0.5;
            var pmax = Math.random() * 0.5 + 0.5;
            var xmin = grbd.xmin * (1 - pmin) + grbd.xmax * pmin;
            var xmax = grbd.xmin * (1 - pmax) + grbd.xmax * pmax;
            for (var i = xmin; i < xmax; i += 20) {
                canv += this.Tree.tree07(
                    xoff + i + 20 * normRand(-1, 1),
                    yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-1, 1) + 0,
                    { hei: normRand(40, 80) },
                );
            }
        }

        for (var i = 0; i < 50 * Math.random(); i++) {
            canv += this.Tree.tree02(
                xoff + normRand(grbd.xmin, grbd.xmax),
                yoff + normRand(grbd.ymin, grbd.ymax),
            );
        }

        var ts = randChoice([0, 0, 0, 0, 1]);
        if (ts == 1 && tt != 4) {
            canv += this.Arch.arch01(
                xoff + normRand(grbd.xmin, grbd.xmax),
                yoff + (grbd.ymin + grbd.ymax) / 2 + 20,
                Math.random(),
                {
                    wid: normRand(160, 200),
                    hei: normRand(80, 100),
                    per: Math.random(),
                },
            );
        }

        return canv;
    };

    distMount(xoff: number, yoff: number, seed: number, args?: any) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 300;
        var len = args.len != undefined ? args.len : 2000;
        var seg = args.seg != undefined ? args.seg : 5;

        seed = seed != undefined ? seed : 0;
        var canv = "";
        var span = 10;

        var ptlist: Point[][] = [];

        for (var i = 0; i < len / span / seg; i++) {
            ptlist.push([]);
            for (var j = 0; j < seg + 1; j++) {
                var tran = (k: number) => {
                    return [
                        xoff + k * span,
                        yoff -
                        hei *
                        this.Noise.noise(k * 0.05, seed) *
                        Math.pow(Math.sin((Math.PI * k) / (len / span)), 0.5),
                    ];
                };
                ptlist[ptlist.length - 1].push(tran(i * seg + j));
            }
            for (var j = 0; j < seg / 2 + 1; j++) {
                var tran = (k: number) => {
                    return [
                        xoff + k * span,
                        yoff +
                        24 *
                        this.Noise.noise(k * 0.05, 2, seed) *
                        Math.pow(Math.sin((Math.PI * k) / (len / span)), 1),
                    ];
                };
                ptlist[ptlist.length - 1].unshift(tran(i * seg + j * 2));
            }
        }
        for (var i = 0; i < ptlist.length; i++) {
            var getCol = (x: number, y: number) => {
                var c = (this.Noise.noise(x * 0.02, y * 0.02, yoff) * 55 + 200) | 0;
                return "rgb(" + c + "," + c + "," + c + ")";
            };
            canv += poly(ptlist[i], {
                fil: getCol(ptlist[i][ptlist[i].length - 1][0], ptlist[i][ptlist[i].length - 1][1]),
                str: "none",
                wid: 1,
            });

            var T = this.PolyTools.triangulate(ptlist[i], {
                area: 100,
                convex: true,
                optimize: false,
            });
            for (var k = 0; k < T.length; k++) {
                var m = this.PolyTools.midPt(T[k]);
                var co = getCol(m[0], m[1]);
                canv += poly(T[k], { fil: co, str: co, wid: 1 });
            }
        }
        return canv;
    };

    rock(xoff: number, yoff: number, seed: number, args: any): string {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 80;
        var wid = args.wid != undefined ? args.wid : 100;
        var tex = args.tex != undefined ? args.tex : 40;
        var ret = args.ret != undefined ? args.ret : 0;
        var sha = args.sha != undefined ? args.sha : 10;

        seed = seed != undefined ? seed : 0;

        var canv = "";

        var reso = [10, 50];
        var ptlist: Point[][] = [];

        for (var i = 0; i < reso[0]; i++) {
            ptlist.push([]);

            var nslist = [];
            for (var j = 0; j < reso[1]; j++) {
                nslist.push(this.Noise.noise(i, j * 0.2, seed));
            }
            loopNoise(nslist);

            for (var j = 0; j < reso[1]; j++) {
                var a = (j / reso[1]) * Math.PI * 2 - Math.PI / 2;
                var l =
                    (wid * hei) /
                    Math.sqrt(
                        Math.pow(hei * Math.cos(a), 2) + Math.pow(wid * Math.sin(a), 2),
                    );

                /*           var l = Math.sin(a)>0? Math.pow(Math.sin(a),0.1)*wid
                                   : - Math.pow(Math.sin(a+Math.PI),0.1)*wid */
                l *= 0.7 + 0.3 * nslist[j];

                var p = 1 - i / reso[0];

                var nx = Math.cos(a) * l * p;
                var ny = -Math.sin(a) * l * p;

                if (Math.PI < a || a < 0) {
                    ny *= 0.2;
                }

                ny += hei * (i / reso[0]) * 0.2;

                ptlist[ptlist.length - 1].push([nx, ny]);
            }
        }

        //WHITE BG
        canv += poly(ptlist[0].concat([[0, 0]]), {
            xof: xoff,
            yof: yoff,
            fil: "white",
            str: "none",
        });
        //OUTLINE
        canv += stroke(
            ptlist[0].map(function (x) {
                return [x[0] + xoff, x[1] + yoff];
            }),
            { col: "rgba(100,100,100,0.3)", noi: 1, wid: 3 },
            this.Noise
        );
        canv += texture(ptlist, {
            xof: xoff,
            yof: yoff,
            tex: tex,
            wid: 3,
            sha: sha,
            col: function (x) {
                return (
                    "rgba(180,180,180," + (0.3 + Math.random() * 0.3).toFixed(3) + ")"
                );
            },
            dis: function () {
                if (Math.random() > 0.5) {
                    return 0.15 + 0.15 * Math.random();
                } else {
                    return 0.85 - 0.15 * Math.random();
                }
            },
        },
            this.Noise);

        for (var i = 0; i < reso[0]; i++) {
            //canv += poly(ptlist[i],{xof:xoff,yof:yoff,fil:"none",str:"red",wid:2})
        }
        return canv;
    };
}