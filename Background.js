var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var offCanvas = document.getElementById("offCanvas");
var offContext = offCanvas.getContext("2d");

var image = new Image();
var isMouseDown = false;
var scale;

window.onload = function(){
    drawBackground();
    draw_new();
    dragFunction(canvas, context);
};

//绘制背景板的主函数入口
function drawBackground() {
    canvas.width = 1500;
    canvas.height = 768;
    console.log("begin1");
    image.src = "地图.png";
    image.onload = function(){

        offCanvas.width = 1152;
        offCanvas.height = image.height;
        scale = offCanvas.width / canvas.width;

        context.drawImage( image , 0 , 0 , 1152 , canvas.height );
        offContext.drawImage( image , 0 , 0 );
    }
}

function windowToCanvas( x , y ){
    var bbox = canvas.getBoundingClientRect();
    return {x:x-bbox.left , y:y-bbox.top}
}

function backgroudMouseDown(e){
    e.preventDefault();
    isMouseDown = true;
    point = windowToCanvas( e.clientX , e.clientY );
    console.log( point.x , point.y );
    drawCanvasWithMagnifier( true , point );
};

function backgroundOnMouseUp(e){
    e.preventDefault();
    isMouseDown = false;
    drawCanvasWithMagnifier( false )
};


function backgroundMouseMove(e){
    e.preventDefault();
    if( isMouseDown == true ){
        point = windowToCanvas( e.clientX , e.clientY );
        console.log( point.x , point.y );
        drawCanvasWithMagnifier( true , point )
    }
}

function drawCanvasWithMagnifier( isShowMagnifier , point ) {

    context.clearRect( 0 , 0 , canvas.width , canvas.height );
    context.drawImage( image , 0 , 0 , 1152 , canvas.height );
    if( isShowMagnifier == true ){
        drawMagnifier( point )
    }
}

function drawMagnifier( point ){

    var mr = 200;

    var imageLG_cx = point.x * scale;
    var imageLG_cy = point.y * scale;

    var sx = imageLG_cx - mr;
    var sy = imageLG_cy - mr;

    var dx = point.x - mr;
    var dy = point.y - mr;

    context.save();

    context.lineWidth = 10.0;
    context.strokeStyle = "#069";

    context.beginPath();
    context.arc( point.x , point.y , mr , 0 , Math.PI*2 , false );
    context.stroke();
    context.clip();
    context.drawImage( offCanvas , sx , sy , 2*mr , 2*mr , dx , dy , 2*mr , 2*mr );
    context.restore()
}