import {Graph} from "./graph.js";
import {Canvas} from "./canvas.js";
let G = new Graph("window","Sled fast graph","ass & grass","velocity",350,350,20,20);
let C = new Canvas("window");
let data = [];
for(let i = 0; i < 10000;i++){
    data.push([i/1000,i*i/1000]);
}
G.draw_data(data,"scatter",10,1,4,"red","PowderBlue");
G.draw_lobf(data);