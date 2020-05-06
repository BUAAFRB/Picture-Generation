var points = [  //物品的参数，预设五个BFV坦克
    { p: [{ x: 0 + 1152, y: 0 }],  click: false, drag: false, types: 4, rot: Math.PI ,class:"icon/BFV.png" },
    { p: [{ x: 0 + 1152, y: 100 }], click: false, drag: false, types: 4, rot: Math.PI, class: "icon/BFV.png" },
    { p: [{ x: 0 + 1152, y: 200 }], click: false, drag: false, types: 4, rot: Math.PI, class: "icon/BFV.png" },
    { p: [{ x: 0 + 1152, y: 300 }], click: false, drag: false, types: 4, rot: Math.PI, class: "icon/BFV.png" },
    { p: [{ x: 0 + 1152, y: 300 }], click: false, drag: false, types: 4, rot: Math.PI, class: "icon/BFV.png"}
];

var points2 = [ //临时物品参数，用以拖拽，平时保证与points相同
    { p: [{ x: 0 + 1152, y: 0 }], click: false, drag: false, types: 4, rot: Math.PI, class: "icon/BFV.png" },
    { p: [{ x: 0 + 1152, y: 100 }], click: false, drag: false, types: 4, rot: Math.PI, class: "icon/BFV.png" },
    { p: [{ x: 0 + 1152, y: 200 }], click: false, drag: false, types: 4, rot: Math.PI, class: "icon/BFV.png" },
    { p: [{ x: 0 + 1152, y: 300 }], click: false, drag: false, types: 4, rot: Math.PI, class: "icon/BFV.png" },
    { p: [{ x: 0 + 1152, y: 300 }], click: false, drag: false, types: 4, rot: Math.PI, class: "icon/BFV.png" }
];

var add_type = "icon/BFV.png"; 

var status = 1; //记录地图当前的状态

var points_no = -1; //记录选中物品的标号

function draw_new() {   //重新刷新画布，每次对画布进行操作后调用
    context.clearRect(0, 0, canvas.width, canvas.height);    // 清除画布，准备绘制
    context.drawImage(image, 0, 0, 1152, canvas.height);
    
    for (i = 0; i < pathpoint.length; i++)//重画出标记的点，并生成路径
        draw_a_point(pathpoint[i].x, pathpoint[i].y,"#ff0099");
    pathGenerate();
   
    for (var i = 0; i < points.length; i++) { //遍历point数组，以每个目标为起点画图
            var imageblock = new Image();
            var imagec = new Image();
            imageblock.src = points[i].class;   //获取物品对应的类型
            imagec.src = "删除.png";
            context.beginPath();
            context.translate(points[i].p[0].x, points[i].p[0].y);  //对物品进行旋转
            context.rotate(points[i].rot);  
            context.drawImage(imageblock, - 50, - 50, 100, 100);
            context.rotate(-points[i].rot);
            context.translate(-points[i].p[0].x, -points[i].p[0].y);
            console.log("Let's draw2");
            if (i == points_no) {   //对被选中的物品，绘制叉号
                context.drawImage(imagec, points[i].p[0].x + 100, points[i].p[0].y - 20, 20, 20);
            }
            context.closePath();
        }
}

function all_buttonClick_try(id) {  //demo中使用，用以修改状态，0为添加物品，1为待选中一个物品，2为已选中一个物品，可修改物品参数，3为标点生成路径
    document.getElementById("status").innerHTML = "现在可以添加物品";
    status = 0;
    add_type = id;
    draw_new();
}


function buttonClick_try() { //demo中使用，用以修改状态
    console.log("buttonClick");
    if (status == 0) {
        document.getElementById("status").innerHTML = "现在可以修改物品参数";
        status = 1;
        draw_new();
    } else if (status == 1 || status == 2) {
        points_no = -1;
        document.getElementById("status").innerHTML = "现在可以标点生成路径";
        status = 3;
        draw_new();
    } else {
        document.getElementById("status").innerHTML = "现在可以修改物品参数";
        status = 1;
        draw_new();
    }
}

function buttonClick1_try() {
    //在标点路径状态可以撤销上一个点
    if (status == 3) {
        undo();
    }else {
        //alert("delete");
        points.pop();
        points2.pop();
        draw_new();
    }
}

function dragFunction(canvas, context) {
    draw_new();

    canvas.onmousedown = canvasClick;
    canvas.onmouseup = stopdrag;
    canvas.onmouseout = stopdrag;
    canvas.onmousemove = drag;
    //canvas.ondblclick = dblik;

    draw_new();
    var isDragging = false;
    var isDraggingArray = false;

    function canvasClick(e) {
        console.log("It is clicked!!");
        var clickX = e.pageX - canvas.offsetLeft;
        var clickY = e.pageY - canvas.offsetTop;
        //触摸地点在画布上
        if (clickX <= 1152) {
            console.log('<= 1152!!!')
        }
        if (status == 0) {  //添加物品
            var newpoint = { p: [{ x: clickX, y: clickY }], click: false, drag: false, types: 4, rot: Math.PI, class: add_type}
            points[points.length] = newpoint;
            points2[points2.length] = newpoint;
            draw_new();
        } else if (status == 1) {   //点击物品可选中
            var complete = -1;
            for (var i = 0; i < points.length; i++) {
                console.log('first')
                context.beginPath();
       
                var flag = false;
                if (points[i].types == 3) {
                    flag = anglecompult(points[i].p, clickX, clickY);

                    status = 2;
                    console.log("end1");
                }
                else if (points[i].types == 4) {
                    flag = arcCompult(points[i].p, clickX, clickY);
                    status = 2;
                    console.log("end2");
                }
                if (flag == true) {
                    points_no = i;
                    console.log('selected');
                    complete = i;
                }

                draw_new();
            }
            if (complete == -1) {   //没有选中物品
                points_no = -1;
                status = 1;
                draw_new();
                console.log("end1233");
            }


        } else if (status == 2) {   //已选中物品，可点击物品，叉号，地图
            console.log('status2');
            var dont = 0;
            context.beginPath();    //以物品中心，点击半径30以内的圆区域视为拖动，半径30至80之间的圆环区域视为改变方向
            context.arc(points[points_no].p[0].x, points[points_no].p[0].y, 80, 0, Math.PI * 2);
            context.arc(points[points_no].p[0].x, points[points_no].p[0].y, 30, 0, Math.PI * 2, true);
         
            if (context.isPointInPath(clickX, clickY)) {
                //alert("drag");
                isDraggingArray = true;
                console.log('改变方向')
                dont = 1;
                return;
            }

            context.beginPath();    //点击叉号删除该物品
            context.rect(points[points_no].p[0].x + 100, points[points_no].p[0].y - 20, 20, 20);
            if (context.isPointInPath(clickX, clickY)) {
                points.splice(points_no, 1);
                points2.splice(points_no, 1);
                points_no = -1;
                status = 1;
                draw_new();
                return;
            }

            context.beginPath();    //拖动物体
            context.rect(points[points_no].p[0].x, points[points_no].p[0].y, 100, 100);
            if (context.isPointInPath(clickX, clickY)) {
                console.log("fin");
                isDragging = true;
                points[points_no].click = true;
                points[points_no].drag = true;
                return;
            }

            //如果物品，叉号，箭头都没有点中，则取消选中
            if (dont == 0 ) {
                points_no = -1;
                status = 1;
                draw_new();
            }



            //status = 1;
        } else if (status == 3){
            //生成路径状态
            drawClickPoint(event);
            pathGenerate();
        }
    }

    function drag(e) {
        console.log("It is dragged!!");
        // 判断是否开始拖拽
        if (status == 2 && points_no >= 0) {
            if (isDraggingArray == true) {
                var x = e.pageX - canvas.offsetLeft;
                var y = e.pageY - canvas.offsetTop;
                //鼠标移动每一帧都清除画布内容，然后重新画圆
                points[points_no].rot = Math.atan2(y - points[points_no].p[0].y, x - points[points_no].p[0].x);
                context.clearRect(0, 0, canvas.width, canvas.height);
                draw_new();
            };
        }
        if (isDragging == true) {
            // 判断拖拽对象是否存在
            // 取得鼠标位置
            var x = e.pageX - canvas.offsetLeft;
            var y = e.pageY - canvas.offsetTop;

            var changdu = points[points_no].p.length;

            var xx = x - points2[points_no].p[0].x;
            var yy = y - points2[points_no].p[0].y;
            if (status == 1) {  //拖动箭头改变方向

            }
            else {
                for (var j = 0; j < changdu; j++) {//将图形拖动到鼠标相应位置
                    points[points_no].p[j].x = points2[points_no].p[j].x + xx;
                    points[points_no].p[j].y = points2[points_no].p[j].y + yy;
                }
                // 更新画布
                draw_new();

            }

        } else {
            backgroundMouseMove(e);
        }
    }

    function stopdrag(e) {
        console.log("It is stop dragged!!");
        isDragging = false;
        isDraggingArray = false;
        if (status == 1) {
            return;
        }
        backgroundOnMouseUp(e);
        if (status == 1) {
            return;
        }
        draw_new();

    }

    function arcCompult(reactpostions, x, y) {//判断鼠标是否在圆形区域内

        context.arc(reactpostions[0].x, reactpostions[0].y, 80, 0, Math.PI * 2);

        if (context.isPointInPath(x, y)) {
            return true;
        } else {
            return false;
        }
    }
}