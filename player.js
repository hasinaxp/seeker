import { smoothstep, vec2 } from "./math.js";

export class Player {
    constructor(grid, pos) {
        this.pos = pos
        this.grid = grid
        this.moveTime = 40
        this.t = 0
        this.target = pos
        this.position = this.pos

        addEventListener('keydown', e=> {
            let p;
            if(this.t < 0.0001 || this.t > .999)
            switch(e.code)
            {
                case 'ArrowUp':
                    p = vec2.add(this.pos, new vec2(0, -1))
                    if(!this.grid.checkFlag(p, 1)) this.target = p
                    break;
                case 'ArrowDown':
                    p = vec2.add(this.pos, new vec2(0, 1))
                    if(!this.grid.checkFlag(p, 1)) this.target = p
                    break;
                case 'ArrowLeft':
                    p = vec2.add(this.pos, new vec2(-1, 0))
                    if(!this.grid.checkFlag(p, 1)) this.target = p
                    break;
                case 'ArrowRight':
                    p = vec2.add(this.pos, new vec2(1, 0))
                    if(!this.grid.checkFlag(p, 1)) this.target = p
                    break;
                default:
                    break;
            }
        })
    }
    move(dt)
    {
        this.t += dt / this.moveTime
        if(this.pos.equals(this.target) || this.t >= 1)
        {
            this.t = 0
            this.pos = this.target
            this.position = this.pos
            return
        }
        function bezierBlend(t)
        {
            return t * t * (3.0 - 2.0 * t);
        }
        this.position = vec2.lerp(this.pos, this.target, bezierBlend(this.t))        
    }
    rays(n)
    {
        let rays = []
        let dirs = []
        for(let i = 0; i < n; i++)
        {
            dirs.push(vec2.dir((Math.PI * 2 * i + Math.random() * 0.1) / n));
        }
        let gp;
        let dist;
        for(let dir of dirs)
        {
            for(let  t = 0; t < 100; t+= 0.2)
            {
                dist = vec2.muls(dir, t)
                gp = vec2.add(this.position, dist)
                if(this.grid.get(gp) == 1)
                {
                    break;
                }
            }
            rays.push(dist)
        }
        return rays
    }
}