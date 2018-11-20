import {Canvas} from "./canvas.js"

export function Graph(window,title,x_axis,y_axis,width,height,x = 0,y = 0,padding = 10,text_width = 10){
    this.canvas = new Canvas(window);
    this.x = x;
    this.y = y;
    this.t_width = width;
    this.t_height = height;//the screen width and height
    this.title = title;
    this.graph_x = x + padding + text_width;//where our data drawing region starts relative to the x,y points
    this.graph_y = y;
    this.text_width = text_width;
    this.graph_ex = x + width;
    this.graph_ey = y + height - padding - text_width;
    this.width = this.graph_ex - this.graph_x;// the width and height of the graphing area.
    this.height = this.graph_ey - this.graph_y;
    this.x_axis = x_axis;
    this.y_axis = y_axis;
    this.padding = padding;

    //setup our graph space;
    this.draw_axis = () => draw_axis(this);
    this.draw_axis();
    this.reset = () => reset(this);
    this.draw_data = ((data,style = "scatter",marks = 10,figs = 1,point_size = 3, point_color = "black",line_color = "black",line_width = 1) => {
        draw_data(this,data,style,marks,figs,point_size,point_color,line_color,line_width)
    });
    this.draw_lobf = (data,color = "black",width = 1) => lobf(this,data,color,width);

    //axis data set by draw_data.
    this.x_max = 0;
    this.x_min = 0;
    this.y_max = 0;
    this.y_min = 0;
}

function draw_axis(G){
    G.canvas.draw_text(G.x + G.t_width/2, G.y + G.text_width,G.title);
    G.canvas.draw_line(G.graph_x,G.graph_ey,G.graph_ex,G.graph_ey,2);
    G.canvas.draw_line(G.graph_x,G.graph_ey,G.graph_x,G.graph_y);
    G.canvas.draw_text((G.graph_ex + G.graph_x)/2,G.graph_ey + G.padding + G.text_width,G.x_axis);
    G.canvas.draw_text(G.graph_x - G.padding - G.text_width/2, (G.graph_ey + G.graph_y)/2,G.y_axis,"black",-Math.PI/2);
}

function reset(G){
    G.canvas.context.clearRect(G.graph_x - G.padding - G.text_width,G.graph_y,G.graph_ex,G.graph_ey + G.padding + G.text_width);
}
//draw a legend.
function draw_legend(){

}

//We take data in points eg [[1,2],[2,2],[3,2],[4,2.2]] etc.
//we will have styles scatter, line, box.
function draw_data(G,data,style,marks,figs,point_size,point_color,line_color,line_width){
    //setup the graph for drawing.
    G.reset();
    G.draw_axis();

    let x_vals = [];
    let y_vals = [];

    data.map(currentValue => {x_vals.push(currentValue[0]); y_vals.push(currentValue[1])});//store our values in each array

    x_vals.sort((a,b) => a-b);
    y_vals.sort((a,b) => a-b);//sort our arrays.

    let min_x = x_vals[0];
    let max_x = x_vals[x_vals.length - 1];
    let min_y = y_vals[0];
    let max_y = y_vals[y_vals.length - 1];
    G.x_max = max_x;
    G.x_min = min_x;
    G.y_min = min_y;
    G.y_max = max_y;
    //produce our axis values for scatter and line plots
    let x_scale = (-x_vals[0] + x_vals[x_vals.length-1])/marks;
    let y_scale = (-y_vals[0] + y_vals[y_vals.length-1])/marks;
    let draw_x = G.graph_x;
    let draw_y = G.graph_ey;
    let draw_sx = G.width/marks;
    let draw_sy = -G.height/marks;

    for(let i = 0;i <= marks;i++){
        G.canvas.draw_text(draw_x,G.graph_ey + G.padding, dec_exp(min_x + (x_scale * i),figs));//draw x
        G.canvas.draw_text(G.graph_x - G.padding + G.text_width/2,draw_y,dec_exp(min_y + (y_scale * i),figs),"black",-Math.PI/2);//draw y

        G.canvas.draw_line(draw_x,G.graph_ey,draw_x,G.graph_ey + 3);//draw our marking bars.
        G.canvas.draw_line(G.graph_x - 3,draw_y,G.graph_x,draw_y);

        draw_x += draw_sx;
        draw_y += draw_sy;
    }
    //setup for drawing the data
    x_scale = G.width/(marks * x_scale);
    y_scale = -G.height/(marks * y_scale);

    let points = [];

    for(let i = 0; i < x_vals.length; i++){
        points[i] = [];
        points[i][0] = G.graph_x + (data[i][0] - min_x) * x_scale;//we need to access data as x_vals and y_vals are sorted independently.
        points[i][1] = G.graph_ey + (data[i][1] - min_y) * y_scale;
    }

    G.canvas.draw_points(points, point_size, true, point_color);
    if(style == "line"){
        G.canvas.draw_line_path(points, line_width, line_color);
    }
}
//

//draw a line of best fit given the data, data must be already drawn in order to do this.
function lobf(G,data,color,width){

    let sum_x = 0;
    let sum_y = 0;
    let sum_xy = 0;
    let sum_x2 = 0;
    data.map(currentValue => {
       sum_x += currentValue[0];
       sum_y += currentValue[1];
       sum_xy += currentValue[0] * currentValue[1];
       sum_x2 += currentValue[0] * currentValue[0];

    });

    let m = (data.length * sum_xy - sum_x * sum_y)/(data.length * sum_x2 - sum_x * sum_x);//we negate due to the orientation of the canvas in html.
    let c = (sum_y - m * sum_x)/data.length;
    let x_max = G.x_max;
    let x_min = G.x_min;
    let d_x = x_max - x_min;
    let y_max = m * x_max + c;
    let y_min = m * x_min + c;
    let d_y = G.y_min - G.y_max;

    x_max = G.graph_x + G.width;
    x_min = G.graph_x;
    y_min = G.graph_ey + ((y_min - G.y_min)/d_y) * G.height;
    y_max = G.graph_ey + ((y_max - G.y_min)/d_y) * G.height;

    G.canvas.draw_line(x_min,y_min,x_max,y_max,width,color);

}
//return A with only S digits after the decimal point.
function dec_exp(A,S){
    let p = Math.pow(10,S);
    return Math.round(A*p)/p;
}