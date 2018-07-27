class Line
{
    frames = [];
    numbers = [];

    constructor(  app,x,y  )
    {
        for(let i = 0; i < 10; i++)
        {
            this.frames.push( PIXI.Texture.fromFrame(i+'.png'));
        }

        for(let i = 0; i < 6; i++)
        {
            this.numbers.push( new PIXI.Sprite( this.frames[0] ));
            this.numbers[i].x = x + i*this.frames[0].width;
            this.numbers[i].y = y;
            app.stage.addChild( this.numbers[i] );
        }

    }
    update( string )
    {
         for(let i = 0; i < this.numbers.length ; i++)
         {
             if( i < string.length )
             {
                 this.numbers[i].texture = this.frames[string[i]];
                 this.numbers[i].visible = true;
             }
             else
             {
                 this.numbers[i].visible = false;
             }

         }
    }
}


class Button extends PIXI.Sprite
{
    constructor( spr,x,y,func )
    {
        super( spr );
        this.x = x;
        this.y = y;
        this.interactive = true;
        this.on('mousedown', ()=>{ this.tint=0x0fffff; });
        this.on('mouseup', ()=>{ this.tint=0xffffff; func(); } );
    }

    enable()
    {
        this.visible = true;
    }

    disable()
    {
        this.visible = false;
    }
}


class Message extends PIXI.Sprite
{
    timeout : number;

    constructor( spr,x,y,timeout )
    {
        super( spr );
        this.x = x;
        this.y = y;
        this.visible = false;
        this.timeout = timeout;
    }
    enable( onTimeOut )
    {
        this.visible = true;
        setTimeout(()=>{ onTimeOut(); },this.timeout );
    }
    disable()
    {
        this.visible = false;
    }
}

export { Button,Message,Line };