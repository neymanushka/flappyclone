'use strict';

let renderer;
let stage;
let background;

window.onload = function() {

    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight
    });

    app.renderer.backgroundColor = 0x4EC0CA;
    renderer = app.renderer;
    document.body.appendChild(app.view);
}

PIXI.loader
.add("textures/sprites.json")
.load(setup);


const passageHeight = 150;
let lastCollumn = null;
let bird;
const gravity = 0.1;
let delta = 0;
let collumns = Array();

let atlas;
let birdsAtlas;
let birdFrames = [];

let back;
let earth;
let scoreText;
let playButton;
let getReadyMsg;
let gameOverMsg;

let gameOver;
let score;
let topScore;

class collumn {
    constructor( stage ){
        this.passed = false;
        this.stage = stage;
        this.top = new PIXI.Sprite( atlas["topTube.png"] );
        this.bottom = new PIXI.Sprite( atlas["bottomTube.png"] );
        this.spawn();
        this.stage.addChild( this.top,this.bottom );
    }
    spawn(){
        if( !lastCollumn)
        {
            this.top.x = this.bottom.x = renderer.width;
        }
        else
        {
            this.top.x = this.bottom.x = lastCollumn.top.x + this.top.width*3;
        }
        lastCollumn = this;
        let height = -(this.top.height-renderer.height/2+random(0,200));
        this.top.y = height;
        this.bottom.y = height + passageHeight + this.top.height;
        this.passed = false;
    }
    move(){
        if( this.top.x > -this.top.width)
        {
            this.top.x -= 3;
            this.bottom.x -= 3;
            if( !this.passed && this.top.x < renderer.width/2 )
            {
                this.passed = true;
                score++;
            }
        }
        else
        {
            this.spawn();
        }
    }
    isCollided( a ){
        return this.intersect( a,this.top) || this.intersect(a,this.bottom);
    }
    intersect( a,b )
    {
        var ab = a.getBounds();
        var bb = b.getBounds();
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }

};

function restart(){
    stage.removeChild( playButton );
    playButton.tint = "0xffffff";
    if( score >= topScore ) topScore = score;
    score = 0;
    gameOver = false;
    lastCollumn = null;
    collumns.forEach( ( e )=> {
        e.spawn();
    });
    bird.y = renderer.height/2.5;
    delta = -2;
    bird.play();

    gameOverMsg.visible = false;
    getReadyMsg.visible = true;
    setTimeout(()=>{ getReadyMsg.visible = false; },1000 );
}

function moveBird(){
    if( bird.y >= renderer.height-130 )
    {
        gameOver = true;
        bird.stop();
    }
    else
    {
        collumns.forEach( ( item ) =>
            {
                if( item.isCollided( bird ) )  gameOver = true;
            }
        );
        bird.y += delta;
        delta += gravity;
        bird.rotation = delta/10;
    }
}

function random(min, max) {
    return Math.round(Math.random() * (max - 1)) + parseInt(min, 10);
  }

function setup(){

    stage = new PIXI.Container();
    background = new PIXI.Container();

    atlas = PIXI.loader.resources["textures/sprites.json"].textures;
    for(let i = 0; i < 4; i++)
    {
        birdFrames.push( PIXI.Texture.fromFrame('bird'+i+'.png'));
    }

    scoreText = new PIXI.Text( "Score:",{fontFamily : 'Arial',fontSize: 48, fill : 0xff1010, align : 'center'});
    scoreText.x = 0;
    scoreText.y = renderer.height-70;

    playButton = new PIXI.Sprite( atlas["playButton.png"] );
    playButton.x = renderer.width/2;
    playButton.y = renderer.height/2;
    playButton.interactive = true;

    getReadyMsg = new PIXI.Sprite( atlas["getReadyMsg.png"] );
    gameOverMsg = new PIXI.Sprite( atlas["gameOverMsg.png"] );
    getReadyMsg.x = gameOverMsg.x = renderer.width/2.1;
    getReadyMsg.y = gameOverMsg.y = renderer.height/2.4;
    gameOverMsg.visible = getReadyMsg.visible = false;

    playButton.on('mousedown', ()=>{ playButton.tint="0x0fffff"; });
    playButton.on('mouseup',restart);

    earth = new PIXI.extras.TilingSprite( atlas["spr_earth.png"],renderer.width );
    earth.y=renderer.height-100;
    bird = new PIXI.extras.AnimatedSprite(birdFrames);
    bird.x = renderer.width/2;
    bird.animationSpeed = 0.2;

    back = new PIXI.extras.TilingSprite( atlas["bg.png"],renderer.width,256 );
    back.y=renderer.height-350

    background.addChild( back );

    stage.addChild( background );
    for( let i=0; i<renderer.width/(atlas["topTube.png"].width*2)+1; i++)
    {
        collumns.push( new collumn( stage ) );
    }
    stage.addChild( earth );
    stage.addChild( bird );
    stage.addChild( scoreText );
    stage.addChild( getReadyMsg );
    stage.addChild( gameOverMsg );

    topScore = 0;

    renderer.plugins.interaction.on('mousedown', () => { if( !gameOver ) delta -= 5;} );
    restart();
    gameLoop();
}

function gameLoop(){
    requestAnimationFrame(gameLoop);

    if(gameOver)
    {
        gameOverMsg.visible = true;
    }
    if( !gameOver )
    {
        collumns.forEach( ( item ) => { item.move();  } );
        earth.tilePosition.x -= 3;
    }
    else
    {
        stage.addChild( playButton );
    }
    moveBird();
    scoreText.text = "Score:" + score + " Top:" + topScore;
    renderer.render( stage );
}
