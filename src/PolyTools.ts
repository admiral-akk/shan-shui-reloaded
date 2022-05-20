import { Area, SegmentLengths, ToLine } from "./GeometryUtils";
import { AssertPoint, AssertTriangle, LineSegment, Point, Triangle } from "./Point";

export class PolyTools {
    midPt(points: Point[]): Point {
        const point = points.reduce(
            function (acc, v) {
                /*       if (v == undefined || acc == undefined){
              console.log("ERRR");
              console.log(plist)
              return [0,0]
            } */
                return [v[0] / points.length + acc[0], v[1] / points.length + acc[1]];
            },
            [0, 0],
        );
        AssertPoint(point);
        return point;
    };

    private sliverRatio(plist: Point[]) {
        AssertTriangle(plist);
        var A = Area(plist);
        var P = SegmentLengths(plist).reduce(function (m, n) {
            return m + n;
        }, 0);
        return A / P;
    }
    private shatter(plist: Triangle, maxArea: number): Triangle[] {
        if (plist.length == 0) {
            return [];
        }
        AssertTriangle(plist);
        if (Area(plist) < maxArea) {
            return [plist];
        } else {
            var slist = SegmentLengths(plist);
            var rightMostIndex = slist.reduce(
                (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
                0,
            );
            var nextIndex = (rightMostIndex + 1) % plist.length;
            var previousIndex = (rightMostIndex + 2) % plist.length;
            try {
                var mid = this.midPt([plist[rightMostIndex], plist[nextIndex]]);
            } catch (err) {
                console.log(plist);
                console.log(err);
                return [];
            }
            return this.shatter([plist[rightMostIndex], mid, plist[previousIndex]], maxArea).concat(
                this.shatter([plist[previousIndex], plist[nextIndex], mid], maxArea),
            );
        }
    }

    private inBounds(p: Point, ln: LineSegment): boolean {
        //non-inclusive
        return (
            Math.min(ln[0][0], ln[1][0]) <= p[0] &&
            p[0] <= Math.max(ln[0][0], ln[1][0]) &&
            Math.min(ln[0][1], ln[1][1]) <= p[1] &&
            p[1] <= Math.max(ln[0][1], ln[1][1])
        );

    }

    private intersect(ln0: LineSegment, ln1: LineSegment): Point | undefined {
        var le0 = ToLine(ln0[0], ln0[1]);
        var le1 = ToLine(ln1[0], ln1[1]);
        var dSlope = le0[0] - le1[0];
        if (dSlope == 0) {
            return undefined;
        }
        var x = (le1[1] - le0[1]) / dSlope;
        var y = le0[0] * x + le0[1];
        if (this.inBounds([x, y], ln0) && this.inBounds([x, y], ln1)) {
            return [x, y];
        }
        return undefined;
    }

    private ptInPoly(pt: Point, plist: Point[]): boolean {
        var scount = 0;
        for (var i = 0; i < plist.length; i++) {
            var np = plist[i != plist.length - 1 ? i + 1 : 0];
            var sect = this.intersect(
                [plist[i], np],
                [pt, [pt[0] + 999, pt[1] + 999]],
            );
            if (sect) {
                scount++;
            }
        }
        return scount % 2 == 1;
    }
    private lnInPoly(ln: LineSegment, plist: Point[]) {
        var lnc = [[0, 0], [0, 0]];
        var ep = 0.01;

        lnc[0][0] = ln[0][0] * (1 - ep) + ln[1][0] * ep;
        lnc[0][1] = ln[0][1] * (1 - ep) + ln[1][1] * ep;
        lnc[1][0] = ln[0][0] * ep + ln[1][0] * (1 - ep);
        lnc[1][1] = ln[0][1] * ep + ln[1][1] * (1 - ep);

        for (var i = 0; i < plist.length; i++) {
            var pt = plist[i];
            var np = plist[i != plist.length - 1 ? i + 1 : 0];
            if (this.intersect(lnc, [pt, np])) {
                return false;
            }
        }
        var mid = this.midPt(ln);
        if (!(this.ptInPoly(mid, plist))) {
            return false;
        }
        return true;
    }

    private bestEar(plist: Point[]): [Triangle, Point[]] {
        var cuts: [Triangle, Point[]][] = [];
        for (var i = 0; i < plist.length; i++) {
            var pt = plist[i];
            var lp = plist[i != 0 ? i - 1 : plist.length - 1];
            var np = plist[i != plist.length - 1 ? i + 1 : 0];
            var qlist = plist.slice();
            qlist.splice(i, 1);
            if (this.convex || this.lnInPoly([lp, np], plist)) {
                if (!this.optimize) {
                    return [[lp, pt, np], qlist];
                }
                cuts.push([[lp, pt, np], qlist]);
            }
        }
        var best: [Triangle, Point[]] = [plist, []];
        var bestRatio = 0;
        for (var i = 0; i < cuts.length; i++) {
            var r = this.sliverRatio(cuts[i][0]);
            if (r >= bestRatio) {
                best = cuts[i];
                bestRatio = r;
            }
        }
        return best;
    }

    area: number = 100;
    convex: boolean = false;
    optimize: boolean = true;

    triangulate(plist: Point[], args: any): Triangle[] {
        var args = args != undefined ? args : {};
        this.area = args.area != undefined ? args.area : 100;
        this.convex = args.convex != undefined ? args.convex : false;
        this.optimize = args.optimize != undefined ? args.optimize : true;
        if (plist.length <= 3) {
            return this.shatter(plist, this.area);
        } else {
            var cut = this.bestEar(plist);
            return this.shatter(cut[0], this.area).concat(
                this.triangulate(cut[1], args),
            );
        }
    }
}