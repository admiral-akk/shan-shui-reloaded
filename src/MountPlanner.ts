import { Memory } from "./Memory";
import { PerlinNoise } from "./PerlinNoise";

export class MountPlanner {
    constructor(private Noise: PerlinNoise, private MEM: Memory) { }
    private locmax(x: number, y: number, f: (x: number, y: number) => number, r: number): boolean {
        var z0 = f(x, y);
        if (z0 <= 0.3) {
            return false;
        }
        for (var i = x - r; i < x + r; i++) {
            for (var j = y - r; j < y + r; j++) {
                if (f(i, j) > z0) {
                    return false;
                }
            }
        }
        return true;
    }

    private chadd(reg: any[], r: any, mind?: number): boolean {
        mind = mind == undefined ? 10 : mind;
        for (var k = 0; k < reg.length; k++) {
            if (Math.abs(reg[k].x - r.x) < mind) {
                return false;
            }
        }
        console.log("+");
        reg.push(r);
        return true;
    }

    mountplanner(xmin: number, xmax: number): any[] {

        var reg: any[] = [];
        var samp = 0.03;
        var ns = (x: number, y: number) => {
            return Math.max(this.Noise.noise(x * samp) - 0.55, 0) * 2;
        };
        var nns = (x: number) => {
            return 1 - this.Noise.noise(x * samp);
        };
        var nnns = (x: number, y: number) => {
            return Math.max(this.Noise.noise(x * samp * 2, 2) - 0.55, 0) * 2;
        };
        var yr = (x: number) => {
            return this.Noise.noise(x * 0.01, Math.PI);
        };

        var xstep = 5;
        var mwid = 200;
        for (var i = xmin; i < xmax; i += xstep) {
            var i1 = Math.floor(i / xstep);
            this.MEM.planmtx[i1] = this.MEM.planmtx[i1] || 0;
        }

        for (var i = xmin; i < xmax; i += xstep) {
            for (var j = 0; j < yr(i) * 480; j += 30) {
                if (this.locmax(i, j, ns, 2)) {
                    var xof = i + 2 * (Math.random() - 0.5) * 500;
                    var yof = j + 300;
                    var r: any = { tag: "mount", x: xof, y: yof, h: ns(i, j) };
                    var res = this.chadd(reg, r);
                    if (res) {
                        for (
                            var k = Math.floor((xof - mwid) / xstep);
                            k < (xof + mwid) / xstep;
                            k++
                        ) {
                            this.MEM.planmtx[k] += 1;
                        }
                    }
                }
            }
            if (Math.abs(i) % 1000 < Math.max(1, xstep - 1)) {
                var r: any = {
                    tag: "distmount",
                    x: i,
                    y: 280 - Math.random() * 50,
                    h: ns(i, j),
                };
                this.chadd(reg, r);
            }
        }
        console.log([xmin, xmax]);
        for (var i = xmin; i < xmax; i += xstep) {
            if (this.MEM.planmtx[Math.floor(i / xstep)] == 0) {
                //var r = {tag:"redcirc",x:i,y:700}
                //console.log(i)
                if (Math.random() < 0.01) {
                    for (var j = 0; j < 4 * Math.random(); j++) {
                        var r: any = {
                            tag: "flatmount",
                            x: i + 2 * (Math.random() - 0.5) * 700,
                            y: 700 - j * 50,
                            h: ns(i, j),
                        };
                        this.chadd(reg, r);
                    }
                }
            } else {
                // var r = {tag:"greencirc",x:i,y:700}
                // chadd(r)
            }
        }

        for (var i = xmin; i < xmax; i += xstep) {
            if (Math.random() < 0.2) {
                var r: any = { tag: "boat", x: i, y: 300 + Math.random() * 390 };
                this.chadd(reg, r, 400);
            }
        }

        return reg;
    }
}