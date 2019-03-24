import { vec4, vec3, vec2, mat3, mat4, glMatrix, quat } from 'gl-matrix';
import Drawable from './rendering/gl/Drawable'


class Turtle {

  position: vec2;
  orient: vec2;
  stack: Turtle[];
  recDepth: number;
  type: number;

    constructor(type: number, pos?: vec2, orient?: vec2){

      if (pos == undefined){
        this.position = vec2.fromValues(this.randomScreenPt(), this.randomScreenPt());
      } else {
        this.position = pos;
      }

      if (orient == undefined){
        this.orient = vec2.fromValues(0.0, 1.0);
      } else {
        this.orient = orient;
      }

      this.type = type;
      this.recDepth = 0;
      this.stack = [];
    }

    randomScreenPt() : number {
      return 2.0 * Math.random() - 1.0;
    }


    branchingRoads() : mat4 {

      if (this.type == 1){
        this.rasterRoads();
      }

      let m : mat4 = mat4.create();
      return m;

    }


    rasterRoads() : mat4 {

      if (this.type == 0){
        this.branchingRoads();
      }

      let m : mat4 = mat4.create();
      return m;


    }

    //my rotate function is not working.

    rotateTurtle(f : number) {

    var cos : any = Math.cos(f * Math.PI / 180.0);
    var sin : any = Math.sin(f * Math.PI / 180.0);

    var o : vec2 = this.orient;
    //console.log("Orientation : " + this.orient[0] + " Orientation Y : " + this.orient[1]);
    //console.log("rotating by " + f);
    var ox : number = cos * o[0] - sin * o[1];
    var oy : number = sin * o[0] + cos * o[1];

    if (Math.abs(ox) < 0.01){
      ox = 0.0;
    }
    if (Math.abs(oy) < 0.01){
      oy = 0.0;
    }
    this.orient[0] = ox;
    this.orient[1] = oy;

    //console.log("Orientation : " + this.orient[0] + " Orientation Y : " + this.orient[1]);

}

getOrientation(f : number) : vec2 {

var cos : any = Math.cos(f * Math.PI / 180.0);
var sin : any = Math.sin(f * Math.PI / 180.0);

var o : vec2 = this.orient;

var ox : number = cos * o[0] - sin * o[1];
var oy : number = sin * o[0] + cos * o[1];

if (Math.abs(ox) < 0.01){
  ox = 0.0;
}
if (Math.abs(oy) < 0.01){
  oy = 0.0;
}
  //returns the degrees of a specific orientation
  return vec2.fromValues(ox, oy);

}

    rotatePos() : void {
      this.orient[0] = this.orient[0]
    }


    rotateNeg() : mat4 {
      let r : mat4 = mat4.create();
      return r;
    }


}

export default Turtle;
