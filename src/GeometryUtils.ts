import { AssertSlopeIntercept, LineSegment, Point, SlopeIntercept, Triangle } from "./Point";

export function Distance(p0: Point, p1: Point): number {
    return Math.sqrt(Math.pow(p0[0] - p1[0], 2) + Math.pow(p0[1] - p1[1], 2));
}

export function ToLine(p0: Point, p1: Point): SlopeIntercept {
    var dX = p1[0] - p0[0];
    var m = dX == 0 ? Infinity : (p1[1] - p0[1]) / dX;
    var k = p1[1] - m * p0[0];
    AssertSlopeIntercept([m, k]);
    return [m, k];
}

export function SegmentLengths(points: Point[]): number[] {
    const lengths = [];
    for (let i = 0; i < points.length; i++) {
        lengths[i] = Distance(points[i], points[(i + 1) % points.length])
    }
    return lengths;
}

export function Area(tri: Triangle): number {
    var slist = SegmentLengths(tri);
    var a = slist[0],
        b = slist[1],
        c = slist[2];
    var s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}