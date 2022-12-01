
export const step = (e, x) => x < e ? 0 : 1
export const min = (a,b) => a < b ? a : b 
export const max = (a,b) => a > b ? a : b
export const clamp = (e1,e2, x) => x < e1 ? e1 : x > e2 ? e2 : x
export const smoothstep = (e0, e1, x) => { x = clamp((x - e0) / (e1 - e0), 0.0, 1.0); return  x * x * (3 - 2 * x); }
export const smootherstep = (e0, e1, x) => { x = clamp((x - e0) / (e1 - e0), 0.0, 1.0); return x * x * x * (x * (x * 6 - 15) + 10); }

export const lerp = (a, b, t) => a + (b - a) * t


export class vec2 {
    constructor(x,y)
    {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }

    copy() { return new vec2(this.x, this.y)}
    neg() { return new vec2(-this.x, -this.y)}
    abs() { return new vec2(Math.abs(this.x), Math.abs(this.y)) }
    floor() { return new vec2(Math.floor(this.x), Math.floor(this.y)) }
    ceil() { return new vec2(Math.ceil(this.x), Math.ceil(this.y)) }
    polar() { return new vec2( Math.atan2(this.y, this.x),  vec2.len(this)) }
    mod(x,y) { return new vec2(this.x % x, this.y % y) }
    wrap(x,y) {
        let v = this.mod(x,y)
        if(v.x < 0) v.x += x
        if(v.y < 0) v.y += y
        return v
    }
    
    angle() {return Math.atan2(this.y, this.x); }
    perpendicular() { let pol = this.polar(); return new vec2(-pol.y * Math.sin(pol.x), pol.y * Math.cos(pol.x))}
    equals(v, tolerance) { tolerance = tolerance ?? 0.00001; return (Math.abs(v.x - this.x) <= tolerance) && (Math.abs(v.y - this.y) <= tolerance);}

    static one = new vec2(1,1)

    static add(v1, v2) { return new vec2(v1.x + v2.x, v1.y + v2.y) }
    static sub(v1, v2) { return new vec2(v1.x - v2.x, v1.y - v2.y) }
    static mul(v1, v2) { return new vec2(v1.x * v2.x, v1.y * v2.y) }
    static div(v1, v2) { return new vec2(v1.x / v2.x, v1.y / v2.y) }

    static adds(v1, s) { return new vec2(v1.x + s, v1.y + s) }
    static subs(v1, s) { return new vec2(v1.x - s, v1.y - s) }
    static muls(v1, s) { return new vec2(v1.x * s, v1.y * s) }
    static divs(v1, s) { return new vec2(v1.x / s, v1.y / s) }

    static dot(v1,v2) { return v1.x * v2.x + v1.y * v2.y }
    static wage(v1, v2) { return v1.x * v2.y - v2.x * v1.y}

    static len({x, y}) {return Math.sqrt(x * x + y * y) }
    static norm(v) { let len = vec2.len(v); return new vec2(v.x/len, v.y/len);}
    static dist(v1, v2) { let x = v1.x - v2.x; let y = v1.y - v2.y; return Math.sqrt(x * x + y * y);  }

    static dir(angle, len = 1) { return new vec2(len * Math.cos(angle), len * Math.sin(angle))}
    static lerp(v1, v2, t) { return new vec2(v1.x + (v2.x - v1.x) * t, v1.y + (v2.y - v1.y) * t)  }
    static rotate(v, angle) { const cos = Math.cos(angle); const sin = Math.sin(angle); return new vec2(cos * v.x- sin * v.y, sin * v.x + cos * v.y) }
    static angleBetween(v1, v2) { return Math.acos(vec2.dot(vec2.norm(v1), vec2.norm(v2))) }
    static reflect( v, n) { var d = vec2.dot(v,n); return new vec2( v.x - 2.0 * d * n.x, v.y - 2.0 * d * n.y); }
}



export function CreateMatrix2D(width, height, v = 0)
{
    let grid = new Array(height);
    for(let i = 0; i < height; i++)
        grid[i] = (new Array(width)).fill(v)
    return grid
}

export function randomPick(arr)
{
    return arr[Math.floor(Math.random() * (arr.length - .0001))]
}

