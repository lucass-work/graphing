//controls drawing to a canvas on the screen including points and lines in simpler functions.

export function Canvas(window) {//arguement is the window id
    //setting up variables
    this.canvas = document.getElementById(window);
    if (this.canvas === undefined) {
        return;
    }

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.font = "10px Arial";
    this.context = this.canvas.getContext("2d");

    //setting up functions
    this.clear = () => this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw_point = (x, y, size = 3, center = true, color = "black") => draw_point(this, x, y, size, center, color);
    this.draw_points = (points,size, center = true, color = "black") => draw_points(this, points, size, center, color);
    this.draw_line = (x, y, ex, ey, width = 1, color = "black") => draw_line(this, x, y, ex, ey, width, color);
    this.draw_line_path = (path,width = 1, color = "black") => draw_line_path(this,path,width,color);
    this.draw_text = (x, y, text, color = "black", rotation = 0) => draw_text(this, x, y, text, color, rotation);
    this.set_font = (F) => {
        this.font = F;
        this.context.font = F;
    }
}

//draws a square point width side length size.
function draw_point(C,x,y,size,center, color){
    let s_x = x;
    let s_y = y;
    if(center){
        s_x -= size/2;
        s_y -= size/2;
    }
    C.context.fillStyle = color;
    C.context.fillRect(s_x,s_y,size,size);
}

function draw_points(C,points,size,center,color){
    for(let P of points){
        draw_point(C,P[0],P[1],size,center,color);
    }
}

function draw_line(C,x,y,ex,ey,width,color) {
    draw_line_path(C, [[x, y], [ex, ey]], width, color);
}
//draws a set of lines connecting each point in path.
function draw_line_path(C,path,width,color){
    if(path.length === 1){
        return;// no point trying to render a line starting at one point.
    }
    C.context.lineWidth = width;
    C.context.strokeStyle = color;
    C.context.beginPath();
    C.context.moveTo(path[0][0],path[0][1]);
    for(let i = 1; i < path.length;i++){
        C.context.lineTo(path[i][0],path[i][1]);
    }
    C.context.stroke();
    C.context.closePath();
}

function draw_text(C,x,y,text,color,rotation){
    let rot = rotation !== 0;
    if(rot) {//dont waste time rotating if we dont need ot
        C.context.save();
        C.context.translate(x,y);
        C.context.rotate(rotation);
    }
    C.context.fillStyle = color;
    C.context.textAlign = "center";
    C.context.fillText(text,rot ? 0 : x,rot ? 0 : y);
    if(rot){
        C.context.restore();
    }
    C.context.stroke();
}

