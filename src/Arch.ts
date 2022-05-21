import { div } from "./Div";
import { PerlinNoise } from "./PerlinNoise";
import { Point } from "./Point";
import { PolyTools } from "./PolyTools";
import { stroke } from "./Stroke";
import { texture } from "./Texture";
import { normRand, poly, randChoice, wtrand } from "./Utils";
import { Man } from "./Man";

export class Arch {

    constructor(private Noise: PerlinNoise, private PolyTools: PolyTools, private Man: Man) { }
    flip(ptlist: Point[] | Point[][], axis?: number) {
        axis = axis == undefined ? 0 : axis;
        for (var i = 0; i < ptlist.length; i++) {
            if (ptlist[i].length > 0) {
                if (typeof ptlist[i] == "object") {
                    const list = ptlist[i] as Point[];
                    for (var j = 0; j < ptlist[i].length; j++) {
                        list[j][0] = axis - (list[j][0] - axis);
                    }
                } else {
                    const point = ptlist[i] as Point;
                    point[0] = axis - (point[0] - axis);
                }
            }
        }
        return ptlist;
    };

    hut(xoff: number, yoff: number, args: any) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 40;
        var wid = args.wid != undefined ? args.wid : 180;
        var tex = args.tex != undefined ? args.tex : 300;

        var reso = [10, 10];
        var ptlist: Point[][] = [];

        for (var i = 0; i < reso[0]; i++) {
            ptlist.push([]);
            var heir = hei + hei * 0.2 * Math.random();
            for (var j = 0; j < reso[1]; j++) {
                var nx =
                    wid * (i / (reso[0] - 1) - 0.5) * Math.pow(j / (reso[1] - 1), 0.7);
                var ny = heir * (j / (reso[1] - 1));
                ptlist[ptlist.length - 1].push([nx, ny]);
            }
        }
        var canv = "";
        canv += poly(
            ptlist[0]
                .slice(0, -1)
                .concat(ptlist[ptlist.length - 1].slice(0, -1).reverse()),
            { xof: xoff, yof: yoff, fil: "white", str: "none" },
        );
        canv += poly(ptlist[0], {
            xof: xoff,
            yof: yoff,
            fil: "none",
            str: "rgba(100,100,100,0.3)",
            wid: 2,
        });
        canv += poly(ptlist[ptlist.length - 1], {
            xof: xoff,
            yof: yoff,
            fil: "none",
            str: "rgba(100,100,100,0.3)",
            wid: 2,
        });

        canv += texture(ptlist, {
            xof: xoff,
            yof: yoff,
            tex: tex,
            wid: 1,
            len: 0.25,
            col: (x: number) => {
                return (
                    "rgba(120,120,120," + (0.3 + Math.random() * 0.3).toFixed(3) + ")"
                );
            },
            dis: () => {
                return wtrand(a => a * a);
            },
            noi: (x: number) => {
                return 5;
            },
        },
            this.Noise);

        for (var i = 0; i < reso[0]; i++) {
            //canv += poly(ptlist[i],{xof:xoff,yof:yoff,fil:"none",str:"red",wid:2})
        }

        return canv;
    };

    box(xoff: number, yoff: number, args: any) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 20;
        var wid = args.wid != undefined ? args.wid : 120;
        var rot = args.rot != undefined ? args.rot : 0.7;
        var per = args.per != undefined ? args.per : 4;
        var tra = args.tra != undefined ? args.tra : true;
        var bot = args.bot != undefined ? args.bot : true;
        var wei = args.wei != undefined ? args.wei : 3;
        var dec =
            args.dec != undefined
                ? args.dec
                : function (arg: any) {
                    return [];
                };

        var mid = -wid * 0.5 + wid * rot;
        var bmid = -wid * 0.5 + wid * (1 - rot);
        var ptlist = [];
        ptlist.push(div([[-wid * 0.5, -hei], [-wid * 0.5, 0]], 5));
        ptlist.push(div([[wid * 0.5, -hei], [wid * 0.5, 0]], 5));
        if (bot) {
            ptlist.push(div([[-wid * 0.5, 0], [mid, per]], 5));
            ptlist.push(div([[wid * 0.5, 0], [mid, per]], 5));
        }
        ptlist.push(div([[mid, -hei], [mid, per]], 5));
        if (tra) {
            if (bot) {
                ptlist.push(div([[-wid * 0.5, 0], [bmid, -per]], 5));
                ptlist.push(div([[wid * 0.5, 0], [bmid, -per]], 5));
            }
            ptlist.push(div([[bmid, -hei], [bmid, -per]], 5));
        }

        var surf = (rot < 0.5 ? 1 : 0) * 2 - 1;
        ptlist = ptlist.concat(
            dec({
                pul: [surf * wid * 0.5, -hei],
                pur: [mid, -hei + per],
                pdl: [surf * wid * 0.5, 0],
                pdr: [mid, per],
            }),
        );

        var polist = [
            [-wid * 0.5, -hei],
            [wid * 0.5, -hei],
            [wid * 0.5, 0],
            [mid, per],
            [-wid * 0.5, 0],
        ];

        var canv = "";
        if (!tra) {
            canv += poly(polist, {
                xof: xoff,
                yof: yoff,
                str: "none",
                fil: "white",
            });
        }

        for (var i = 0; i < ptlist.length; i++) {
            canv += stroke(
                ptlist[i].map(function (x) {
                    return [x[0] + xoff, x[1] + yoff];
                }),
                {
                    col: "rgba(100,100,100,0.4)",
                    noi: 1,
                    wid: wei,
                    fun: (x: number) => {
                        return 1;
                    },
                },
                this.Noise
            );
        }
        return canv;
    };

    deco(style: number, args: any) {
        var args = args != undefined ? args : {};
        var pul = args.pul != undefined ? args.pul : [0, 0];
        var pur = args.pur != undefined ? args.pur : [0, 100];
        var pdl = args.pdl != undefined ? args.pdl : [100, 0];
        var pdr = args.pdr != undefined ? args.pdr : [100, 100];
        var hsp = args.hsp != undefined ? args.hsp : [1, 3];
        var vsp = args.vsp != undefined ? args.vsp : [1, 2];

        var plist = [];
        var dl = div([pul, pdl], vsp[1]);
        var dr = div([pur, pdr], vsp[1]);
        var du = div([pul, pur], hsp[1]);
        var dd = div([pdl, pdr], hsp[1]);

        if (style == 1) {
            //-| |-
            var mlu = du[hsp[0]];
            var mru = du[du.length - 1 - hsp[0]];
            var mld = dd[hsp[0]];
            var mrd = dd[du.length - 1 - hsp[0]];

            for (var i = vsp[0]; i < dl.length - vsp[0]; i += vsp[0]) {
                var mml = div([mlu, mld], vsp[1])[i];
                var mmr = div([mru, mrd], vsp[1])[i];
                var ml = dl[i];
                var mr = dr[i];
                plist.push(div([mml, ml], 5));
                plist.push(div([mmr, mr], 5));
            }
            plist.push(div([mlu, mld], 5));
            plist.push(div([mru, mrd], 5));
        } else if (style == 2) {
            //||||

            for (var i = hsp[0]; i < du.length - hsp[0]; i += hsp[0]) {
                var mu = du[i];
                var md = dd[i];
                plist.push(div([mu, md], 5));
            }
        } else if (style == 3) {
            //|##|
            var mlu = du[hsp[0]];
            var mru = du[du.length - 1 - hsp[0]];
            var mld = dd[hsp[0]];
            var mrd = dd[du.length - 1 - hsp[0]];

            for (var i = vsp[0]; i < dl.length - vsp[0]; i += vsp[0]) {
                var mml = div([mlu, mld], vsp[1])[i];
                var mmr = div([mru, mrd], vsp[1])[i];
                var mmu = div([mlu, mru], vsp[1])[i];
                var mmd = div([mld, mrd], vsp[1])[i];

                var ml = dl[i];
                var mr = dr[i];
                plist.push(div([mml, mmr], 5));
                plist.push(div([mmu, mmd], 5));
            }
            plist.push(div([mlu, mld], 5));
            plist.push(div([mru, mrd], 5));
        }
        return plist;
    };

    rail(xoff: number, yoff: number, seed: number, args: any) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 20;
        var wid = args.wid != undefined ? args.wid : 180;
        var rot = args.rot != undefined ? args.rot : 0.7;
        var per = args.per != undefined ? args.per : 4;
        var seg = args.seg != undefined ? args.seg : 4;
        var wei = args.wei != undefined ? args.wei : 1;
        var tra = args.tra != undefined ? args.tra : true;
        var fro = args.fro != undefined ? args.fro : true;

        seed = seed != undefined ? seed : 0;

        var mid = -wid * 0.5 + wid * rot;
        var bmid = -wid * 0.5 + wid * (1 - rot);
        var ptlist = [];

        if (fro) {
            ptlist.push(div([[-wid * 0.5, 0], [mid, per]], seg));
            ptlist.push(div([[mid, per], [wid * 0.5, 0]], seg));
        }
        if (tra) {
            ptlist.push(div([[-wid * 0.5, 0], [bmid, -per]], seg));
            ptlist.push(div([[bmid, -per], [wid * 0.5, 0]], seg));
        }
        if (fro) {
            ptlist.push(div([[-wid * 0.5, -hei], [mid, -hei + per]], seg));
            ptlist.push(div([[mid, -hei + per], [wid * 0.5, -hei]], seg));
        }
        if (tra) {
            ptlist.push(div([[-wid * 0.5, -hei], [bmid, -hei - per]], seg));
            ptlist.push(div([[bmid, -hei - per], [wid * 0.5, -hei]], seg));
        }
        if (tra) {
            var open = Math.floor(Math.random() * ptlist.length);
            ptlist[open] = ptlist[open].slice(0, -1);
            ptlist[(open + ptlist.length) % ptlist.length] = ptlist[
                (open + ptlist.length) % ptlist.length
            ].slice(0, -1);
        }
        var canv = "";

        for (var i = 0; i < ptlist.length / 2; i++) {
            for (var j = 0; j < ptlist[i].length; j++) {
                //ptlist.push(div([ptlist[i][j],ptlist[4+i][j]],2))
                ptlist[i][j][1] += (this.Noise.noise(i, j * 0.5, seed) - 0.5) * hei;
                ptlist[(ptlist.length / 2 + i) % ptlist.length][
                    j % ptlist[(ptlist.length / 2 + i) % ptlist.length].length
                ][1] += (this.Noise.noise(i + 0.5, j * 0.5, seed) - 0.5) * hei;
                var ln = div(
                    [
                        ptlist[i][j],
                        ptlist[(ptlist.length / 2 + i) % ptlist.length][
                        j % ptlist[(ptlist.length / 2 + i) % ptlist.length].length
                        ],
                    ],
                    2,
                );
                ln[0][0] += (Math.random() - 0.5) * hei * 0.5;
                canv += poly(ln, {
                    xof: xoff,
                    yof: yoff,
                    fil: "none",
                    str: "rgba(100,100,100,0.5)",
                    wid: 2,
                });
            }
        }

        for (var i = 0; i < ptlist.length; i++) {
            canv += stroke(
                ptlist[i].map(function (x) {
                    return [x[0] + xoff, x[1] + yoff];
                }),
                {
                    col: "rgba(100,100,100,0.5)",
                    noi: 0.5,
                    wid: wei,
                    fun: (x: number) => {
                        return 1;
                    },
                },
                this.Noise
            );
        }
        return canv;
    };

    roof(xoff: number, yoff: number, args: any) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 20;
        var wid = args.wid != undefined ? args.wid : 120;
        var rot = args.rot != undefined ? args.rot : 0.7;
        var per = args.per != undefined ? args.per : 4;
        var cor = args.cor != undefined ? args.cor : 5;
        var wei = args.wei != undefined ? args.wei : 3;
        var pla = args.pla != undefined ? args.pla : [0, ""];

        var opf = (ptlist: Point[]): Point[] => {
            if (rot < 0.5) {
                return this.flip(ptlist) as Point[];
            } else {
                return ptlist;
            }
        };
        var rrot = rot < 0.5 ? 1 - rot : rot;

        var mid = -wid * 0.5 + wid * rrot;
        var bmid = -wid * 0.5 + wid * (1 - rrot);
        var quat = (mid + wid * 0.5) * 0.5 - mid;

        var ptlist: Point[][] = [];
        ptlist.push(
            div(
                opf([
                    [-wid * 0.5 + quat, -hei - per / 2],
                    [-wid * 0.5 + quat * 0.5, -hei / 2 - per / 4],
                    [-wid * 0.5 - cor, 0],
                ]),
                5,
            ),
        );
        ptlist.push(
            div(
                opf([
                    [mid + quat, -hei],
                    [(mid + quat + wid * 0.5) / 2, -hei / 2],
                    [wid * 0.5 + cor, 0],
                ]),
                5,
            ),
        );
        ptlist.push(
            div(
                opf([
                    [mid + quat, -hei],
                    [mid + quat / 2, -hei / 2 + per / 2],
                    [mid + cor, per],
                ]),
                5,
            ),
        );

        ptlist.push(div(opf([[-wid * 0.5 - cor, 0], [mid + cor, per]]), 5));
        ptlist.push(div(opf([[wid * 0.5 + cor, 0], [mid + cor, per]]), 5));

        ptlist.push(
            div(opf([[-wid * 0.5 + quat, -hei - per / 2], [mid + quat, -hei]]), 5),
        );

        var canv = "";

        var polist = opf([
            [-wid * 0.5, 0],
            [-wid * 0.5 + quat, -hei - per / 2],
            [mid + quat, -hei],
            [wid * 0.5, 0],
            [mid, per],
        ]);
        canv += poly(polist, { xof: xoff, yof: yoff, str: "none", fil: "white" });

        for (var i = 0; i < ptlist.length; i++) {
            canv += stroke(
                ptlist[i].map(function (x) {
                    return [x[0] + xoff, x[1] + yoff];
                }),
                {
                    col: "rgba(100,100,100,0.4)",
                    noi: 1,
                    wid: wei,
                    fun: (x: number) => {
                        return 1;
                    },
                },
                this.Noise
            );
        }

        if (pla[0] == 1) {
            var pp = opf([
                [mid + quat / 2, -hei / 2 + per / 2],
                [-wid * 0.5 + quat * 0.5, -hei / 2 - per / 4],
            ]);
            if (pp[0][0] > pp[1][0]) {
                pp = [pp[1], pp[0]];
            }
            var mp = this.PolyTools.midPt(pp);
            var a = Math.atan2(pp[1][1] - pp[0][1], pp[1][0] - pp[0][0]);
            var adeg = (a * 180) / Math.PI;
            canv +=
                "<text font-size='" +
                hei * 0.6 +
                "' font-family='Verdana'" +
                " style='fill:rgba(100,100,100,0.9)'" +
                " text-anchor='middle' transform='translate(" +
                (mp[0] + xoff) +
                "," +
                (mp[1] + yoff) +
                ") rotate(" +
                adeg +
                ")'>" +
                pla[1] +
                "</text>";
        }
        return canv;
    };

    pagroof(xoff: number, yoff: number, args: any) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 20;
        var wid = args.wid != undefined ? args.wid : 120;
        var rot = args.rot != undefined ? args.rot : 0.7;
        var per = args.per != undefined ? args.per : 4;
        var cor = args.cor != undefined ? args.cor : 10;
        var sid = args.sid != undefined ? args.sid : 4;
        var wei = args.wei != undefined ? args.wei : 3;

        var ptlist: Point[][] = [];
        var polist = [[0, -hei]];
        var canv = "";
        for (var i = 0; i < sid; i++) {
            var fx = wid * ((i * 1.0) / (sid - 1) - 0.5);
            var fy = per * (1 - Math.abs((i * 1.0) / (sid - 1) - 0.5) * 2);
            var fxx = (wid + cor) * ((i * 1.0) / (sid - 1) - 0.5);
            if (i > 0) {
                ptlist.push([ptlist[ptlist.length - 1][2], [fxx, fy]]);
            }
            ptlist.push([[0, -hei], [fx * 0.5, (-hei + fy) * 0.5], [fxx, fy]]);
            polist.push([fxx, fy]);
        }

        canv += poly(polist, { xof: xoff, yof: yoff, str: "none", fil: "white" });
        for (var i = 0; i < ptlist.length; i++) {
            canv += stroke(
                div(ptlist[i], 5).map(function (x) {
                    return [x[0] + xoff, x[1] + yoff];
                }),
                {
                    col: "rgba(100,100,100,0.4)",
                    noi: 1,
                    wid: wei,
                    fun: (x: number) => {
                        return 1;
                    },
                },
                this.Noise
            );
        }

        return canv;
    };

    arch01(xoff: number, yoff: number, seed: number, args: any) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 70;
        var wid = args.wid != undefined ? args.wid : 180;
        var rot = args.rot != undefined ? args.rot : 0.7;
        var per = args.per != undefined ? args.per : 5;

        seed = seed != undefined ? seed : 0;

        var p = 0.4 + Math.random() * 0.2;
        var h0 = hei * p;
        var h1 = hei * (1 - p);

        var canv = "";
        canv += this.hut(xoff, yoff - hei, { hei: h0, wid: wid });
        canv += this.box(xoff, yoff, {
            hei: h1,
            wid: (wid * 2) / 3,
            per: per,
            bot: false,
        });

        canv += this.rail(xoff, yoff, seed, {
            tra: true,
            fro: false,
            hei: 10,
            wid: wid,
            per: per * 2,
            seg: (3 + Math.random() * 3) | 0,
        });

        var mcnt = randChoice([0, 1, 1, 2]);
        if (mcnt == 1) {
            canv += this.Man.man(xoff + normRand(-wid / 3, wid / 3), yoff, {
                fli: randChoice([true, false]),
                sca: 0.42,
            });
        } else if (mcnt == 2) {
            canv += this.Man.man(xoff + normRand(-wid / 4, -wid / 5), yoff, {
                fli: false,
                sca: 0.42,
            });
            canv += this.Man.man(xoff + normRand(wid / 5, wid / 4), yoff, {
                fli: true,
                sca: 0.42,
            });
        }
        canv += this.rail(xoff, yoff, seed, {
            tra: false,
            fro: true,
            hei: 10,
            wid: wid,
            per: per * 2,
            seg: (3 + Math.random() * 3) | 0,
        });

        return canv;
    };

    arch02(xoff: number, yoff: number, seed: number, args: any) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 10;
        var wid = args.wid != undefined ? args.wid : 50;
        var rot = args.rot != undefined ? args.rot : 0.3;
        var per = args.per != undefined ? args.per : 5;
        var sto = args.sto != undefined ? args.sto : 3;
        var sty = args.sty != undefined ? args.sty : 1;
        var rai = args.rai != undefined ? args.rai : false;

        seed = seed != undefined ? seed : 0;
        var canv = "";

        var hoff = 0;
        for (var i = 0; i < sto; i++) {
            canv += this.box(xoff, yoff - hoff, {
                tra: false,
                hei: hei,
                wid: wid * Math.pow(0.85, i),
                rot: rot,
                wei: 1.5,
                per: per,
                dec: (arg: any) => {
                    return this.deco(
                        sty,
                        Object.assign({}, a, {
                            hsp: [[], [1, 5], [1, 5], [1, 4]][sty],
                            vsp: [[], [1, 2], [1, 2], [1, 3]][sty],
                        }),
                    );
                },
            });
            canv += rai
                ? this.rail(xoff, yoff - hoff, i * 0.2, {
                    wid: wid * Math.pow(0.85, i) * 1.1,
                    hei: hei / 2,
                    per: per,
                    rot: rot,
                    wei: 0.5,
                    tra: false,
                })
                : "";
            var pla = undefined;
            if (sto == 1 && Math.random() < 1 / 3) {
                pla = [1, "Pizza Hut"];
            }
            canv += this.roof(xoff, yoff - hoff - hei, {
                hei: hei,
                wid: wid * Math.pow(0.9, i),
                rot: rot,
                wei: 1.5,
                per: per,
                pla: pla,
            });

            hoff += hei * 1.5;
        }
        return canv;
    };
    arch03(xoff: number, yoff: number, seed: number, args: any) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 10;
        var wid = args.wid != undefined ? args.wid : 50;
        var rot = args.rot != undefined ? args.rot : 0.7;
        var per = args.per != undefined ? args.per : 5;
        var sto = args.sto != undefined ? args.sto : 7;

        seed = seed != undefined ? seed : 0;
        var canv = "";

        var hoff = 0;
        for (var i = 0; i < sto; i++) {
            canv += this.box(xoff, yoff - hoff, {
                tra: false,
                hei: hei,
                wid: wid * Math.pow(0.85, i),
                rot: rot,
                wei: 1.5,
                per: per / 2,
                dec: (arg: any) => {
                    return this.deco(1, Object.assign({}, a, { hsp: [1, 4], vsp: [1, 2] }));
                },
            });
            canv += this.rail(xoff, yoff - hoff, i * 0.2, {
                seg: 5,
                wid: wid * Math.pow(0.85, i) * 1.1,
                hei: hei / 2,
                per: per / 2,
                rot: rot,
                wei: 0.5,
                tra: false,
            });
            canv += this.pagroof(xoff, yoff - hoff - hei, {
                hei: hei * 1.5,
                wid: wid * Math.pow(0.9, i),
                rot: rot,
                wei: 1.5,
                per: per,
            });
            hoff += hei * 1.5;
        }
        return canv;
    };
    arch04(xoff: number, yoff: number, seed: number, args: any) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 15;
        var wid = args.wid != undefined ? args.wid : 30;
        var rot = args.rot != undefined ? args.rot : 0.7;
        var per = args.per != undefined ? args.per : 5;
        var sto = args.sto != undefined ? args.sto : 2;

        seed = seed != undefined ? seed : 0;
        var canv = "";

        var hoff = 0;
        for (var i = 0; i < sto; i++) {
            canv += this.box(xoff, yoff - hoff, {
                tra: true,
                hei: hei,
                wid: wid * Math.pow(0.85, i),
                rot: rot,
                wei: 1.5,
                per: per / 2,
                dec: function (a) {
                    return [];
                },
            });
            canv += this.rail(xoff, yoff - hoff, i * 0.2, {
                seg: 3,
                wid: wid * Math.pow(0.85, i) * 1.2,
                hei: hei / 3,
                per: per / 2,
                rot: rot,
                wei: 0.5,
                tra: true,
            });
            canv += this.pagroof(xoff, yoff - hoff - hei, {
                hei: hei * 1,
                wid: wid * Math.pow(0.9, i),
                rot: rot,
                wei: 1.5,
                per: per,
            });
            hoff += hei * 1.2;
        }
        return canv;
    };

    boat01(xoff: number, yoff: number, seed: number, args: any) {
        var args = args != undefined ? args : {};
        var len = args.len != undefined ? args.len : 120;
        var sca = args.sca != undefined ? args.sca : 1;
        var fli = args.fli != undefined ? args.fli : false;
        var canv = "";

        var dir = fli ? -1 : 1;
        canv += this.Man.man(xoff + 20 * sca * dir, yoff, {
            ite: this.Man.stick01,
            hat: this.Man.hat02,
            sca: 0.5 * sca,
            fli: !fli,
            len: [0, 30, 20, 30, 10, 30, 30, 30, 30],
        });

        var plist1 = [];
        var plist2 = [];
        var fun1 = (x: number) => {
            return Math.pow(Math.sin(x * Math.PI), 0.5) * 7 * sca;
        };
        var fun2 = (x: number) => {
            return Math.pow(Math.sin(x * Math.PI), 0.5) * 10 * sca;
        };
        for (var i = 0; i < len * sca; i += 5 * sca) {
            plist1.push([i * dir, fun1(i / len)]);
            plist2.push([i * dir, fun2(i / len)]);
        }
        var plist = plist1.concat(plist2.reverse());
        canv += poly(plist, { xof: xoff, yof: yoff, fil: "white" });
        canv += stroke(plist.map(v => [xoff + v[0], yoff + v[1]]), {
            wid: 1,
            fun: function (x) {
                return Math.sin(x * Math.PI * 2);
            },
            col: "rgba(100,100,100,0.4)",
        },
            this.Noise);

        return canv;
    };

    transmissionTower01(xoff: number, yoff: number, seed: number, args: any) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 100;
        var wid = args.wid != undefined ? args.wid : 20;

        var canv = "";
        var toGlobal = (v: Point) => {
            return [v[0] + xoff, v[1] + yoff];
        };

        var quickstroke = (pl: Point[]) => {
            return stroke(div(pl, 5).map(toGlobal), {
                wid: 1,
                fun: (x: number) => 0.5,
                col: "rgba(100,100,100,0.4)",
            }
                , this.Noise);
        };

        var p00 = [-wid * 0.05, -hei];
        var p01 = [wid * 0.05, -hei];

        var p10 = [-wid * 0.1, -hei * 0.9];
        var p11 = [wid * 0.1, -hei * 0.9];

        var p20 = [-wid * 0.2, -hei * 0.5];
        var p21 = [wid * 0.2, -hei * 0.5];

        var p30 = [-wid * 0.5, 0];
        var p31 = [wid * 0.5, 0];

        var bch = [[0.7, -0.85], [1, -0.675], [0.7, -0.5]];

        for (var i = 0; i < bch.length; i++) {
            canv += quickstroke([
                [-bch[i][0] * wid, bch[i][1] * hei],
                [bch[i][0] * wid, bch[i][1] * hei],
            ]);
            canv += quickstroke([
                [-bch[i][0] * wid, bch[i][1] * hei],
                [0, (bch[i][1] - 0.05) * hei],
            ]);
            canv += quickstroke([
                [bch[i][0] * wid, bch[i][1] * hei],
                [0, (bch[i][1] - 0.05) * hei],
            ]);

            canv += quickstroke([
                [-bch[i][0] * wid, bch[i][1] * hei],
                [-bch[i][0] * wid, (bch[i][1] + 0.1) * hei],
            ]);
            canv += quickstroke([
                [bch[i][0] * wid, bch[i][1] * hei],
                [bch[i][0] * wid, (bch[i][1] + 0.1) * hei],
            ]);
        }

        var l10 = div([p00, p10, p20, p30], 5);
        var l11 = div([p01, p11, p21, p31], 5);

        for (var i = 0; i < l10.length - 1; i++) {
            canv += quickstroke([l10[i], l11[i + 1]]);
            canv += quickstroke([l11[i], l10[i + 1]]);
        }

        canv += quickstroke([p00, p01]);
        canv += quickstroke([p10, p11]);
        canv += quickstroke([p20, p21]);
        canv += quickstroke([p00, p10, p20, p30]);
        canv += quickstroke([p01, p11, p21, p31]);

        return canv;
    };

}