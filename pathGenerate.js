var pathpoint = [];
var blockPointList = [];

function getStyles(obj){//兼容FF，IE10; IE9及以下未测试
    return document.defaultView.getComputedStyle(obj);
}

//获取鼠标在canvas上的坐标
function getCanvasPos(canvas,e)
{
    var rect = canvas.getBoundingClientRect();
    var leftB = parseInt(getStyles(canvas).borderLeftWidth);//获取的是样式，需要转换为数值
    var topB = parseInt(getStyles(canvas).borderTopWidth);
    return {
        x: (e.clientX - rect.left) - leftB,
        y: (e.clientY - rect.top) - topB
    };
}

//在画布上画一个点
function draw_a_point(x,y,style) {
    var cxt = context;

    cxt.fillStyle = style;
    cxt.beginPath();
    //cxt.arc(mousePos(e).x,mousePos(e).y,15,0,Math.PI*2,true)
    cxt.arc(x,y,3,0,Math.PI*2,true);
    cxt.closePath();
    cxt.fill();
}

//在窗口载入的时候画出障碍物
/*window.onload = function () {
    var c=document.getElementById("myCanvas");
    //Main_drawBlocks(c);
    drawBlocks();
}*/

//暂时先画出固定障碍物
function drawBlocks() {

    for (var k = 1; k < 5; k++) {
        var circleBlocks = {p: {x: 100+20*k, y : 100+20*k}, color: "#ffaaaa"};
        var r = 0.1 * 100;

        for (var x1 = circleBlocks.p.x - r; x1 < circleBlocks.p.x + r; x1++) {
            for (var y1 = circleBlocks.p.y - r; y1 < circleBlocks.p.y + r; y1++) {
                if ((x1 - circleBlocks.p.x)^2 + (y1 - circleBlocks.p.y)^2 < r ^ 2) {
                    blockPointList.push({x : x1, y : y1});
                }
            }
        }
        draw_circle(circleBlocks.p.x, circleBlocks.p.y, r);
    }

    function draw_circle(x,y,r) {

        context.beginPath();
        context.arc(x, y, r,0,Math.PI*2,true);
        context.strokeStyle = "#caff67";
        context.lineWidth = "3";
        context.fillStyle = "#2ffe3c";
        context.stroke();
        context.fill();
        context.closePath();
    }

}

//得到鼠标点击事件并画出点
function drawClickPoint(e)
{
    var c=canvas;

    //判断是否在障碍物内部标点
    if(isin(Point(getCanvasPos(c,e).x,getCanvasPos(c,e).y))) {
        window.alert("you can't draw the point in blocks!");
    } else {
        draw_a_point(getCanvasPos(c,e).x,getCanvasPos(c,e).y,"#ff0099");
        //将标的点加入点数组
        pathpoint.push({
            x: getCanvasPos(c, e).x,
            y: getCanvasPos(c, e).y
        });
        //console.log(point);
    }
}


//判断是否d点是障碍点
function isin(d) {
    var flag=0;
    for (var i=0;i<blockPointList.length;i++) {
        if(d.x === blockPointList[i].x) {
            if (d.y === blockPointList[i].y) {
                flag = 1;
                break;
            }
        }
    }
    return flag === 1;
}

//Astar法连接相邻点
function pathGenerate() {
    var c = canvas;
    var cxt = c.getContext("2d");

    for(i=0;i<pathpoint.length-1;i++) {  //每两个点之间用A-star算法连线
        //先判断两点之间是否存在障碍物
        var flag = 0;
        var loopstart, loopend;
        var k = (pathpoint[i].y-pathpoint[i+1].y) / (pathpoint[i].x-pathpoint[i+1].x);
        if (pathpoint[i].x < pathpoint[i+1].x) {
            loopstart = pathpoint[i];
            loopend = pathpoint[i+1];
        } else {
            loopstart = pathpoint[i+1];
            loopend = pathpoint[i];
        }
        for (var m=0;m<loopend.x-loopstart.x;m++){
            var p1 = Point(loopstart.x+m,parseInt(loopstart.y+m*k));
            if (isin(p1)) {
                flag = 1;
                break;
            }
        }
        //开始判定使用的连线方法
        if (flag === 1) { //存在障碍物，使用Astar算法
            //得到Astar算法运行后的末尾点
            var p = A_star(Point(pathpoint[i].x,pathpoint[i].y),Point(pathpoint[i+1].x,pathpoint[i+1].y));
            //通过找父节点回复整条路径
            while(p.Parent != null) {
                cxt.beginPath();
                cxt.moveTo(p.x,p.y);
                cxt.lineTo(p.Parent.x,p.Parent.y);
                cxt.closePath();
                cxt.stroke();
                p = p.Parent;
            }
        } else { //不存在障碍物，直接直线相连
            cxt.beginPath();
            cxt.moveTo(loopstart.x,loopstart.y);
            cxt.lineTo(loopend.x,loopend.y);
            cxt.closePath();
            cxt.stroke();
        }
    }

}

//Astar算法中的点的类
var Point = function (x,y) {
    if(this instanceof Point) {
        this.init(x,y);
    }
    else {
        return new Point(x,y);
    }
}

//Astar算法中的点的数据结构（包含F，G，H值，父节点等）
Point.prototype= {
    init: function (x, y) {
        this.x = x;
        this.y = y;
    },
    Parent: null,
    F: 0,
    G: 0,
    H: 0,
    x: 0,
    y: 0,
    calf: function () {
        this.F = this.G + this.H;
    }
}

//Astar算法连接s，e两点
function A_star(s,e) {

    //开放点集，可以被选择的点
    var openlist = [];
    //关闭点集，不能被选择的点
    var closelist = [];

    openlist.push(s);
    while(openlist.length !== 0) {
        console.log("loop");
        //找出F值最小的点
        var tempstart = MinFPoint(openlist);
        //console.log(tempstart);
        closelist.push(tempstart);
        Remove(openlist,tempstart);
        //找出它的相邻点
        var sur = findSurroundPoints(tempstart,1);
        for (var i=0;i<sur.length;i++) {
            var po = sur[i];
            if (Exist(openlist,po)) {
                //该点已经在openlist中，计算G值，若大于原来G值则不变，小于则设置它的父节点为当前节点，并更新G，F
                FoundPoint(tempstart,po);
            }
            else {
                //不在openlist列表里，就将其加入列表，并且设置好父节点，计算GHF
                NoFoundPoint(tempstart,e,po);
            }
        }
        if (GetPoint(openlist,e) != null) {
            return GetPoint(openlist,e);
        }
    }
    return GetPoint(openlist,e);

    function FoundPoint(tempstart,po) {
        var G = calG(tempstart,po);
        if (G < po.G) {
            po.Parent = tempstart;
            po.G = G;
            po.calf();
        }
    }

    function NoFoundPoint(tempstart,end,po) {
        po.Parent = tempstart;
        po.G = calG(tempstart,po);
        po.H = calH(end,po);
        po.calf();
        openlist.push(po);
    }

    //计算G值
    function calG(start,po) {
        //斜着走代价加14，否则10
        var G = (Math.abs(po.x-start.x) + Math.abs(po.y-start.y)) === 2 ? 14 : 10;
        var parentG = po.Parent != null ? po.Parent.G : 0;
        return G + parentG;
    }

    //计算H值
    function calH(end,po) {
        var step = Math.abs(end.x-po.x) + Math.abs(end.y-po.y);
        return step*10;
    }

    /**
     * @return {null}
     */
    //从list中拿出po点
    function GetPoint(list,po) {
        for (var k=0;k<list.length;k++) {
            if (list[k].x === po.x && list[k].y === po.y) {
                return list[k];
            }
        }
        return null;
    }

    //从list中找到最小F值的点
    function MinFPoint(list) {
        var min = list[0];
        //console.log(min);
        for (var i=1;i<list.length;i++) {
            if(min.F > list[i].F) {
                min = list[i];
            }
        }
        return min;
    }

    //从list中删去p点
    function Remove(list,p) {
        for (var i=0;i<list.length;i++) {
            if(list[i].x === p.x && list[i].y === p.y) {
                return list.splice(i,1);
            }
        }
    }

    /**
     * @return {boolean}
     判断list中是否存在p*/
    function Exist(list,p) {
        for (var i=0;i<list.length;i++) {
            if(list[i].x === p.x && list[i].y === p.y) {
                return true;
            }
        }
        return false;
    }

    //找到不是障碍物品的相邻点
    function findSurroundPoints(p,isIgnoreCorner)
    {
        var sur = [];

        var p1 = Point(p.x-1,p.y-1);
        var p2 = Point(p.x-1,p.y);
        var p3 = Point(p.x-1,p.y+1);
        var p4 = Point(p.x,p.y-1);
        var p5 = Point(p.x,p.y+1);
        var p6 = Point(p.x+1,p.y-1);
        var p7 = Point(p.x+1,p.y);
        var p8 = Point(p.x+1,p.y+1);

        if(!isin(p1)) {
            sur.push(p1);
        }
        if(!isin(p2)) {
            sur.push(p2);
        }
        if(!isin(p3)) {
            sur.push(p3);
        }
        if(!isin(p4)) {
            sur.push(p4);
        }
        if(!isin(p5)) {
            sur.push(p5);
        }
        if(!isin(p6)) {
            sur.push(p6);
        }
        if(!isin(p7)) {
            sur.push(p7);
        }
        if(!isin(p8)) {
            sur.push(p8);
        }

        return sur;
    }
}


//清空所有点
function  refresh() {
    var c=canvas;
    var cxt=c.getContext("2d");
    //drawBlocks();
    pathpoint = [];
    draw_new();
}

//撤销上一个标的点
function undo() {
    var c=canvas;
    var cxt=c.getContext("2d");
    //drawBlocks();
    pathpoint.pop();
    draw_new();

}

