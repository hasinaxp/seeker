import { CreateMatrix2D, vec2 } from "./math.js"
import { Player } from "./player.js"
import { Objective } from "./objective.js"
import { generateDungeon, WorldGrid } from "./worldGrid.js"




//canvas setup
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
document.body.appendChild(canvas)

canvas.width = innerWidth
canvas.height = innerHeight
const cols = 100
let aspect = canvas.width / canvas.height
let rows = Math.floor(cols / aspect)
let dx = Math.floor(canvas.width / cols)
let dy = Math.floor(canvas.height / rows)
let offset = new vec2(rows/2, cols/2)
addEventListener('resize', e => {
    canvas.width = innerWidth
    canvas.height = innerHeight
    aspect = canvas.width / canvas.height
    rows = Math.floor(cols / aspect)
    dx = Math.floor(canvas.width / cols)
    dy = Math.floor(canvas.height / rows)
    offset = new vec2(rows/2, cols/2)
})



let worldGridSize = 1000
let worldGrid = new WorldGrid(worldGridSize, worldGridSize,1)
const startPosition = new vec2(0,0)
let timer = 1000 * 10
let currentTime = 0
let currentLevel = 1
// generateDungeon({
//     grid: worldGrid,
//     steps: 2000,
//     roomSize: 2,
// });
let player = new Player(worldGrid, startPosition)
let playerScore = 0
let objectiveCount = 0

function GenObjectives(mapSize = 500, density = 40)
{
    const successProb = 1 - density / 10000
    for(let y = -mapSize; y < mapSize; y++)
    for(let x = -mapSize; x < mapSize; x++)
    {
        let pos = new vec2(x,y)
        if(worldGrid.get(pos) !== 1)
        {
            let prob = Math.random()
            if(prob > successProb)
            {
                worldGrid.set(pos, 4) // 4 for objective
                objectiveCount++
            }

        }
    }
}

function initLevel(lev)
{
    worldGridSize = lev * 50
    worldGrid = new WorldGrid(worldGridSize, worldGridSize,1)
    generateDungeon({
        grid: worldGrid,
        steps: lev * 100,
        roomSize: 3,
    });
    objectiveCount = 0
    GenObjectives(worldGridSize/2, lev * 2 + 10)
    player = new Player(worldGrid, startPosition)
    timer = Math.ceil(Math.sqrt(lev)) * 1000 * 30 + 5000
    currentTime = 0

}



function DrawGridPortion(pos, t)
{
    let startPos = vec2.sub(pos, offset)
    let startPos2 = startPos.floor()
    let off = vec2.sub(vec2.one, vec2.sub(startPos, startPos2))

    for(let y = -1; y <= rows; y++ )
    for(let x = -1; x <= cols; x++ )
    {
        let v = worldGrid.get(new vec2(startPos.x + x, startPos.y + y))
        if(v === 1)
        {
            ctx.fillStyle = '#1118'
            ctx.fillRect(x * dx + Math.floor(off.x * dx), y * dy + Math.floor(off.y * dy), dx, dy)
        }
        if(v === 4)
        {
            ctx.fillStyle = `hsla(${t/20 + 100}, 40%, 40%, 0.6)`
            const xp = x * dx + Math.floor(off.x * dx) + dx /2
            const yp = y * dy + Math.floor(off.y * dy) + dy /2
            ctx.beginPath()
            ctx.arc(xp, yp, 10 * Math.abs(Math.sin(t * 0.005)), 0, Math.PI * 2)
            ctx.fill()
            //ctx.fillRect(x * dx + Math.floor(off.x * dx), y * dy + Math.floor(off.y * dy), dx, dy)
        }
    }
    return off
}




function render(t)
{
    
    //clear canvas
    ctx.fillStyle = '#1111'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    


    ctx.lineWidth = 10
    ctx.strokeStyle = `hsla(${t/20}, 90%, 70%, 0.2)`
    let rays = player.rays(360)
    for(let ray of rays)
    {
        ctx.beginPath()
        ctx.moveTo( (offset.x +  1.5) * dx,  (offset.y + 1.5 ) * dy)
        ctx.lineTo((offset.x + ray.x  +  1) * dx, (offset.y + ray.y  +  1) * dy)
        ctx.stroke()

    }    

    
    let playerOff = DrawGridPortion(player.position, t)


    ctx.fillStyle = '#4ff'
    ctx.fillRect((offset.x + 1.0 ) * dx, (offset.y + 1.0) * dy, dx, dy)


    ctx.fillStyle = '#fff'
    ctx.font = '24px Helvetica'
    ctx.fillText(`score: ${playerScore}`, 30, 30)
    ctx.fillText(`objectives left: ${objectiveCount}`, 200, 30)
    ctx.fillText(`time left: ${Math.floor((timer- currentTime)/1000)}s`, 500, 30)
    ctx.fillText(`level: ${currentLevel}`, 700, 30)

}




function loadAudio(src) {
    let audio = new Audio(src)
    return new Promise(res => {
        audio.onload = res(audio)
    })
}

let eatAudio = await loadAudio('./eatsound.wav')


initLevel(currentLevel)
//main simulation loop
let elapsedTime = 0
function simulation(t)
{
    let dt = t - elapsedTime
    if(Number.isNaN(dt))
        dt = 0
    currentTime += dt
    elapsedTime = t
    requestAnimationFrame(simulation)
    if(timer - currentTime > 0) {

        player.move(dt)
        if(worldGrid.get(player.position) === 4)
        {
            worldGrid.set(player.position, 0)
            if(Math.random() > 0.65)
            {
                ctx.fillStyle = '#e00'
                ctx.fillRect(0,0, canvas.width, canvas.height)
                setTimeout(() => {
                    ctx.fillStyle = '#e00'
                    ctx.fillRect(0,0, canvas.width, canvas.height)
                }, 100)
                setTimeout(() => {
                    ctx.fillStyle = '#e00'
                    ctx.fillRect(0,0, canvas.width, canvas.height)
                }, 200)
                setTimeout(() => {
                    ctx.fillStyle = '#e64'
                    ctx.fillRect(0,0, canvas.width, canvas.height)
                }, 250)
            }
            playerScore += 10
            objectiveCount--
            eatAudio.play()
            if(objectiveCount <= 0) {
                initLevel(++currentLevel)
                ctx.fillStyle = '#8e5'
                ctx.fillRect(0,0, canvas.width, canvas.height)
                setTimeout(() => {
                    ctx.fillStyle = '#8f9'
                    ctx.fillRect(0,0, canvas.width, canvas.height)
                }, 50)
            }
        }
        render(t)
    }
    else {
        ctx.fillStyle = '#fff'
    ctx.font = '40px Helvetica'
    ctx.fillText(`game over!!!! your score: ${playerScore}`, Math.floor(innerWidth/2), Math.floor(innerHeight/2))
    }
    document.title = `${Math.floor(1000/dt)}fps`
}
simulation()