import { random } from "./Util";


function Tube( topSprite,bottomSprite,x,center )
{
    this.top = new PIXI.Sprite( topSprite );
    this.bottom = new PIXI.Sprite( bottomSprite );
    this.top.x = this.bottom.x = x;
    this.center = center;

    this.setHeight = function()
    {
        let r = random(-100,100);
        this.top.y = center - 70 - this.top.height - r;
        this.bottom.y = center + 70 - r;
        this.passed = false;
    }
    this.setHeight();
};


function Tubes( top,bottom,app )
{
    this.tubes = new Array();
    this.last;

    for( let i=0; i < app.renderer.width / (top.width*3) + 2; i++)
    {
        this.tubes.push( new Tube( top, bottom, app.renderer.width, app.renderer.height / 2 ) );
    }

    this.setPosition = function()
    {
        let x = app.renderer.width;
        for( let i=0; i<this.tubes.length; i++)
        {
            this.tubes[i].top.x = this.tubes[i].bottom.x = x;
            this.tubes[i].setHeight();
            x += top.width*3;
        }
        this.last = this.tubes[this.tubes.length-1];
        this.passed = false;
    }

    this.setPosition();

    for( let i=0; i<this.tubes.length; i++)
    {
        app.stage.addChild( this.tubes[i].top );
        app.stage.addChild( this.tubes[i].bottom );
    }

    this.move = function()
    {
        let score = 0;

        for( let i=0; i<this.tubes.length; i++)
        {
            if( this.tubes[i].top.x > -this.tubes[i].top.width)
            {
                this.tubes[i].top.x -= 3;
                this.tubes[i].bottom.x -= 3;

                if( !this.tubes[i].passed && this.tubes[i].top.x < app.renderer.width/2 - this.tubes[i].top.width/2 )
                {
                    this.tubes[i].passed = true;
                    score = 1;
                }

            }
            else
            {
                this.tubes[i].top.x = this.tubes[i].bottom.x = this.last.top.x + this.tubes[i].top.width*3;
                this.tubes[i].setHeight();
                this.last = this.tubes[i];
            }
        }
        return score;
    }
    this.len = function()
    {
        return this.tubes.length;
    }


}


export { Tubes };