import { CreateMatrix2D, randomPick, vec2 } from "./math.js"


export class WorldGrid
{
    constructor(width, height, initialValue = 0) {
        this.width = width
        this.height = height
        this.grid = CreateMatrix2D(width, height, initialValue)
    }
    get(pos) {
        let point = pos.floor().wrap(this.width, this.height)
        return this.grid[point.y][point.x]
    }
    set(pos, v)
    {
        let point = pos.floor().wrap(this.width, this.height)
        this.grid[point.y][point.x] = v
    }
    setfunc(pos, func) {
        let point = pos.floor().wrap(this.width, this.height)
        this.grid[point.y][point.x] = func(this.grid[point.y][point.x])
    }
    setFlag(pos, flag) {
        let point = pos.floor().wrap(this.width, this.height)
        this.grid[point.y][point.x] |= flag
    }
    checkFlag(pos, flag) {
        let point = pos.floor().wrap(this.width, this.height)
        return this.grid[point.y][point.x] & flag
    }

}

export function generateDungeon({
    steps = 20,
    startpos = new vec2(0,0),
    grid,
    roomSize = 4,
    roomVariance = 4,
    walkSize = 8,
    walkVariance = 4

})
{
    const dirs = [new vec2(1,0),new vec2(-1,0),new vec2(0,1),new vec2(0,-1)]
    function createRoom(pos, w) {
        for(let y  =-w; y < w; y++)
        for(let x  =-w; x < w; x++)
        {
            grid.set(vec2.add(pos ,new vec2(x,y)), 0)
        }
    }
    const rs = Math.floor(roomSize / 2)
    let currentsSteps = 0
    let pos = startpos;
    


    while(currentsSteps < steps) {
        let dir  = randomPick(dirs)
        let walkDist = walkSize + Math.floor(Math.random() * walkVariance)
        let roomsz = rs + Math.floor(Math.random() * roomVariance)
        
        
        while(walkDist--)
        {
            pos = vec2.add(pos, dir)
            grid.set(pos, 0);
        }
        createRoom(pos, roomsz)
        
        currentsSteps++
        
    }
    return grid
}


