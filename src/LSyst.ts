
import Turtle from './Turtle'
import { vec3, vec2, vec4, mat4, quat } from 'gl-matrix';

class LSyst {

  currState: Turtle;
  depthLimit: number;

  range : number;
  branch: number;

  startPos: vec2;

  pointList: vec4[] = [];

  // expRules: Map<number, any>; // Store expansion rules?

  constructor(start : vec2, range : number, branch:number) {

      //sets a random start for the LSystem
      this.currState = new Turtle(1);
      this.startPos = start;//vec2.fromValues(Math.random() * 2.0 - 1.0, - 1.0);

      this.currState.position = this.startPos;
      this.range = range;
      this.branch = branch;



  }

  evaluate (iter : number) {

      for (var a = 0; a < iter; a++){

      var min : number = 0.0;
      var end: vec2;
      //sample 10 random points to find the highest population within 0.1 radius
      for(var i = 0; i < 10.0; i++){
        var po : number = this.currState.position[0] + ((Math.random() * 2.0 - 1.0) / (15.0 - this.range));
        var po1 : number = this.currState.position[1] + ((Math.random()  / 2.5));
        //console.log("POINT : " + po + " " + po1);
        var pop : number = this.landComputation(vec2.fromValues(po, po1));
        //console.log(pop);
        if (pop > min){
          min = pop;
        }
        end = vec2.fromValues(po, po1);
      }

      //we now have the point (vec2 with the greatest population density of our random sample)
      var set1 : vec2 = this.currState.position;
      var set2 : vec2 = end;

      var p1 : vec4 = vec4.fromValues(set1[0], set1[1], set2[0], set2[1]);
      var p2 : vec4 = vec4.fromValues(set1[0] - 0.03, set1[1], set2[0] - 0.03, set2[1]);

      this.pointList.push(p1);
      this.pointList.push(p2);
      this.currState.position = end;

      if(!(p1[0] < 0.0 && end[1] > -0.5 && end[1] < 0.7)){//in the water range){
      if(p1[1] < 0.0 && Math.random() < 0.5){

        for(var i = 0; i < 5.0; i++){
          var po : number;
          if (Math.random() < 0.5 + (this.branch / 30.0)){
           po = this.currState.position[0] + ((Math.random() * 2.0 - 1.0) / 10.0);
         } else {
           po = this.currState.position[0] - ((Math.random() * 2.0 - 1.0) / 10.0);
         }
          var po1 : number = this.currState.position[1] + ((Math.random()  / 2.5));
          //console.log("POINT : " + po + " " + po1);
          var pop : number = this.landComputation(vec2.fromValues(po, po1));
          //console.log(pop);
          if (pop > min){
            min = pop;
          }
          end = vec2.fromValues(po, po1);
        }

        set1 = this.currState.position;
        set2 = end;
        var a1 : vec4 = vec4.fromValues(set1[0], set1[1], set2[0], set2[1]);
        var a2 : vec4 = vec4.fromValues(set1[0] - 0.02, set1[1], set2[0] - 0.02, set2[1]);

        this.pointList.push(a1);
        this.pointList.push(a2);
      }
    }

  }
}



random2(p: vec2, seed: vec2) : vec2 {
    let pseed: vec2 = vec2.create();
    vec2.add(pseed, p, seed);
    let dotProduct1 = vec2.dot(pseed, vec2.fromValues(311.7, 127.1));
    let dotProduct2 = vec2.dot(pseed, vec2.fromValues(269.5, 183.3))

    let vector: vec2 = vec2.fromValues(dotProduct1, dotProduct2);
    vector = vec2.fromValues(Math.sin(vector[0]) * 85734.3545, Math.sin(vector[1]) * 85734.3545);
    vector = vec2.fromValues(vector[0] - Math.floor(vector[0]), vector[1] - Math.floor(vector[1]));

    return vector;
}



worleyFunc(x : number, y: number, numRows: number, numCols: number) : number {
    let xPos: number = x * numCols / 20;
    let yPos: number = y * numRows / 20;

    let minDist: number = 60;

    // let minVec: vec2 = vec2.fromValues(0, 0);

    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            let gridPOs: vec2 = vec2.fromValues(Math.floor(xPos) + i, Math.floor(yPos) + j);
            let noisePos: vec2 = vec2.create();
            vec2.add(noisePos, gridPOs, this.random2(gridPOs, vec2.fromValues(2, 0)));
            let current_Dist: number = vec2.distance(vec2.fromValues(xPos, yPos), noisePos);
            if (current_Dist <= minDist) {
                minDist = current_Dist;
                // minVec = noisePos;
            }
        }
    }
    return minDist;
}

fbmWorley(x : number, y : number, height : number, xScale : number, yScale : number) : number {
  var total : number = 0.0;
  var persistence : number = 0.5;
  var octaves : number = 7;
  var freq : number = 2.0;
  var amp : number = 1.0;
  for (var i = 0; i < octaves; i++) {
    // total += interpNoise2d( (x / xScale) * freq, (y / yScale) * freq) * amp;
    var worley = this.worleyFunc( (x / xScale) * freq, (y / yScale) * freq, 2.0, 2.0);
    total = total + worley * amp;
    freq = freq *  2.0;
    amp  = amp * persistence;
  }
  return height * total;
}


fbmWorley2(x : number, y : number, height : number, xScale : number, yScale : number) : number {
  var total : number = 0.0;
  var persistence : number = 0.5;
  var octaves : number = 7;
  var freq : number = 2.0;
  var amp : number = 1.0;
  for (var i = 0; i < octaves; i++) {
    // total += interpNoise2d( (x / xScale) * freq, (y / yScale) * freq) * amp;
    var worley = this.worleyFunc( (x / xScale) * freq, (y / yScale) * freq, 1.0, 1.0);
    total = total + worley * amp;
    freq = freq *  2.0;
    amp  = amp * persistence;
  }
  return height * total;
}


landComputation(fs_Pos : vec2) : number {


    var x : number = 0.5 * (fs_Pos[0] + 1.0);
    var y : number = 0.5 * (fs_Pos[1] + 1.0);
    var heightPoint : number = 1.0 - Math.pow(this.fbmWorley(0.8 * 512.0 * x, 0.95 * 512.0 * y, 0.9, 100.0, 120.0), 1.5);
    var worleyComp : number = 0.01 * (1.0 - Math.pow(this.worleyFunc(512.0 * x, 512.0 * y, 1.0, 0.1), 1.0));
    if (heightPoint  + worleyComp > 0.49) {
      //water is -1
     return -1.0;
    }
    var population : number = Math.pow((1.0 - this.fbmWorley2(512.0 * x, 512.0 * y, 0.5, 10.0, 15.0)), 4.9);

    return population;


}



}

export default LSyst;
