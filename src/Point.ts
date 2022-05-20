

export type Point = number[];
export type SlopeIntercept = number[];
export type LineSegment = Point[];
export type Triangle = Point[];

export function AssertPoint(value: number[]): asserts value is Point {
    if (value.length !== 2) {
        throw new Error("Not valid point!");
    }
}

export function AssertTriangle(value: Point[]): asserts value is Triangle {
    if (value.length !== 3) {
        throw new Error("Not valid triangle!");
    }
}

export function AssertPointList(value: number[][]): asserts  value is Point[] {

    if (value.filter(p => p.length !== 2).length === 0) {
        throw new Error("Not valid list of points!");
    }
}

export function AssertSlopeIntercept(value: number[]): asserts value is SlopeIntercept {

    if (value.length !== 2) {
        throw new Error("Not valid slope intercept");
    }
}

export function AssertLineSegment(value: Point[]): asserts value is LineSegment {

    if (value.length !== 2) {
        throw new Error("Not valid line segment");
    }
}