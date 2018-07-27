class Bird extends PIXI.extras.AnimatedSprite
{
    delta = 0;
    isFlies = false;
    gravity = 0.1;
    startHeight;

    constructor( frames,x,y )
    {
        super( frames );
        this.disable();
        this.x = x;
        this.startHeight = y;
    }

    disable()
    {
        this.visible = false;
    }

    init()
    {
        this.y = this.startHeight/2;
        this.delta = -2;
        this.gravity = 0.1;
        this.visible = true;
        this.isFlies = true;
        this.animationSpeed = 0.2;
        this.play();
    }

    speedUp()
    {
        if( this.isFlies ) this.delta -= 5;
    }

    update( delta )
    {
        super.update( delta );

        if( this.y >= this.startHeight-130 )
        {
            this.stop();
            this.isFlies = false;
        }
        else
        {
            this.y += this.delta;
            this.delta += this.gravity;
            this.rotation = this.delta/10;
        }
    }
}

// function Bird( app )
// {
//     this.frames = [];
//     this.delta = 0;
//     this.isFlies = false;

//     for(let i = 0; i < 4; i++)
//     {
//         this.frames.push( PIXI.Texture.fromFrame('bird'+i+'.png'));
//     }

//     this.sprite = new PIXI.extras.AnimatedSprite( this.frames );
//     this.sprite.animationSpeed = 0.2;

//     this.disable = function()
//     {
//         this.sprite.visible = false;
//     }

//     this.disable();

//     this.init = function()
//     {
//         this.sprite.x = app.renderer.width/2;
//         this.sprite.y = app.renderer.height/2;
//         this.delta = -2;
//         this.gravity = 0.1;
//         this.sprite.visible = true;
//         this.isFlies = true;
//         this.sprite.play();
//     };

//     this.speedUp = function()
//     {
//         if( this.isFlies ) this.delta -= 5;
//     }
//     this.update = function()
//     {
//         if( this.sprite.y >= app.renderer.height-130 )
//         {
//             this.sprite.stop();
//             this.isFlies = false;
//         }
//         else
//         {
//             this.sprite.y += this.delta;
//             this.delta += this.gravity;
//             this.sprite.rotation = this.delta/10;
//         }
//     }
// }

export { Bird };