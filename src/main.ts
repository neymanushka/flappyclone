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
    if( score > topScore ) topScore = score;

    gameOver = true;
    msgGameOver.enable( ()=> {
        msgGameOver.disable();
        button.enable();
    });
}

function onGameStart()
{
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
        if( intersect( bird,tubes.tubes[i].top) || intersect( bird,tubes.tubes[i].bottom) )
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

    button = new Button( atlas["playButton.png"],app.renderer.width/2,app.renderer.height/2,onGameStart );

    msgGetReady = new Message( atlas["getReadyMsg.png"],app.renderer.width/2.1,app.renderer.height/2.3,2000 );
    msgGameOver = new Message( atlas["gameOverMsg.png"],app.renderer.width/2.1,app.renderer.height/2.3,2000 );


    let frames = new Array();
    for(let i = 0; i < 4; i++)
    {
        frames.push( PIXI.Texture.fromFrame('bird'+i+'.png'));
    }

    bird = new Bird( frames,app.renderer.width/2,app.renderer.height );

    far.addChild( background );
    app.stage.addChild( far );
    tubes = new Tubes( atlas["topTube.png"],atlas["bottomTube.png"],app );
    app.stage.addChild( earth,button );
    app.stage.addChild( msgGetReady, msgGameOver );
    app.stage.addChild( bird);
    app.stage.addChild( top );

    scoreLine = new Line( app,10,10 );
    topScoreLine = new Line( app,app.renderer.width - 140,10 );

    renderer.plugins.interaction.on('mousedown', ()=>{ if( !gameOver ) bird.speedUp(); } );

    app.ticker.add( gameLoop, this);
};

function gameLoop( delta )
{
    if( !gameOver )
    {
        if( bird.isFlies )
        {
            score += tubes.move();
            earth.tilePosition.x -= 3;
        }
        else onGameOver();
        if( isCollided()  )
        {
            onGameOver();
        }
    }
    scoreLine.update( score.toString() );
    topScoreLine.update( topScore.toString() );

    renderer.render( app.stage );
}