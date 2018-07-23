import * as PIXI from "pixi.js";
import { Tubes } from "./Tubes";
import { Button,Message,Line } from "./UI"
import { Bird } from "./Bird"
import { intersect } from "./Util"

const app = new PIXI.Application( window.innerWidth,window.innerHeight,
    {
        backgroundColor: 0x4EC0CA
    }
);

let renderer = app.renderer;
document.body.appendChild(app.view);

let far;

let atlas;
let tubes;
let earth;
let background;

let bird;
let button;
let top;
let score = 0;
let topScore = 0;
let scoreLine;
let topScoreLine;
let msgGetReady;
let msgGameOver;
let gameOver = true;

PIXI.loader
.add("atlas","textures/sprites.json")
.load(setup);

function onGameOver()
{
    console.log("stop game");

    if( score > topScore ) topScore = score;

    gameOver = true;
    msgGameOver.enable( ()=> {
        msgGameOver.disable();
        button.enable();
    });
}

function onGameStart()
{
    console.log("start game");

    score = 0;
    tubes.setPosition();
    button.disable();
    bird.disable();
    msgGetReady.enable( ()=> {
        msgGetReady.disable();
        bird.init();
        gameOver = false;
    });
}

function isCollided()
{
    for( let i=0; i<tubes.len(); i++ )
    {
        if( intersect( bird.sprite,tubes.tubes[i].top) || intersect( bird.sprite,tubes.tubes[i].bottom) )
        {
            return true;
        }
    }
}

function setup() {

    far = new PIXI.Container();
    atlas = PIXI.loader.resources["atlas"].textures;


    top = new PIXI.Sprite( atlas["topScore.png"] );
    top.x = app.renderer.width - top.width - 150;

    background = new PIXI.extras.TilingSprite( atlas["bg.png"],renderer.width,256 );
    background.y = renderer.height - 350
    earth = new PIXI.extras.TilingSprite( atlas["spr_earth.png"],renderer.width );
    earth.y = renderer.height-100;

    button = new Button( new PIXI.Sprite( atlas["playButton.png"]),app.renderer.width/2,app.renderer.height/2,onGameStart );

    msgGetReady = new Message( new PIXI.Sprite( atlas["getReadyMsg.png"] ),app.renderer.width/2.1,app.renderer.height/2.3,2000 );
    msgGameOver = new Message( new PIXI.Sprite( atlas["gameOverMsg.png"] ),app.renderer.width/2.1,app.renderer.height/2.3,2000 );


    bird = new Bird( app );

    far.addChild( background );
    app.stage.addChild( far );
    tubes = new Tubes( atlas["topTube.png"],atlas["bottomTube.png"],app );
    app.stage.addChild( earth );
    app.stage.addChild( button.sprite );
    app.stage.addChild( msgGetReady.sprite );
    app.stage.addChild( msgGameOver.sprite );
    app.stage.addChild( bird.sprite );
    app.stage.addChild( top );

    scoreLine = new Line( app,0,0 );
    topScoreLine = new Line( app,app.renderer.width - 140,10 );

    renderer.plugins.interaction.on('mousedown', ()=>{ if( !gameOver ) bird.speedUp(); } );

    gameLoop();
};

function gameLoop(){
    requestAnimationFrame(gameLoop);

    if( !gameOver )
    {
        if( bird.isFlies )
        {
            score += tubes.move();
             earth.tilePosition.x -= 3;
        }
        if( isCollided()  )
        {
            onGameOver();
        }
    }
    bird.update();
    scoreLine.update( score.toString() );
    topScoreLine.update( topScore.toString() );

    renderer.render( app.stage );
}