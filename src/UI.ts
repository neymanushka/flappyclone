
function Number( frame,x,y )
{
    this.sprite = new PIXI.Sprite( frame );
    this.sprite.x = x;
    this.sprite.y = y;
}

function Line( app,x,y )
{
    this.frames = [];
    this.numbers = new Array();

    for(let i = 0; i < 10; i++)
    {
        this.frames.push( PIXI.Texture.fromFrame(i+'.png'));
    }

    for(let i = 0; i < 6; i++)
    {
        this.numbers.push( new Number( this.frames[0],x + i*this.frames[0].width,y ));
        app.stage.addChild( this.numbers[i].sprite );
    }

    this.update = function( string )
    {
        for(let i = 0; i < this.numbers.length ; i++)
        {
            if( i < string.length )
            {
                this.numbers[i].sprite.texture = this.frames[string[i]];
                this.numbers[i].sprite.visible = true;
            }
            else
            {
                this.numbers[i].sprite.visible = false;
            }

        }
    }

}


function Button( spr,x,y,func )
{
    this.sprite = spr;
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.interactive = true;
    this.sprite.on('mousedown', ()=>{ this.sprite.tint="0x0fffff"; });
    this.sprite.on('mouseup', ()=>{ this.sprite.tint="0xffffff"; func(); } );

    this.enable = function()
    {
        this.sprite.visible = true;
    }
    this.disable = function()
    {
        this.sprite.visible = false;
    }
}


function Message( spr,x,y,timeout )
{
    this.sprite = spr;
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.visible = false;
    this.timeout = timeout;

    this.enable = function( onTimeOut )
    {
        this.sprite.visible = true;
        setTimeout(()=>{ onTimeOut(); },this.timeout );
    }
    this.disable = function()
    {
        this.sprite.visible = false;
    }
}


export { Button,Message,Line };