import ExpansionRules from './ExpansionRules';
import DrawRules from './DrawRules';
import Turtle from './Turtle'
import LSystemMesh from './geometry/LSystemMesh'
import Leaf from './geometry/Leaf'
import Mario from './geometry/Mario'
import { vec3, vec2, vec4, mat4 } from 'gl-matrix';

class LSystem {

  currState: Turtle;
  depthLimit: number;
  drawRules: Map<number, any>;
  axiom: any;
  grammar: any;
  points: vec2[];
  // expRules: Map<number, any>; // Store expansion rules?

  constructor(lim: number, angle: number, roadType: number) {
      this.currState = new Turtle(roadType);
      this.depthLimit = lim;

      this.axiom = "XY";

      this.drawRules = new Map();
      this.drawRules.set(0, this.currState.branchingRoads.bind(this.currState));
      this.drawRules.set(1, this.currState.rasterRoads.bind(this.currState));

  }

  //Appropriately expand the grammar
  expand(depth : number, expanded : string) {
      // Stop after a certain recursion depth is reached and set the member variable
      if (depth > this.depthLimit) {
          this.grammar = expanded;
          return;
      }

      // Create a new string to store the expansion of the current input
      let newStr : string = '';

      // Loop over all characters in the input string and add them to the new one
      for (var i = 0; i < expanded.length; ++i) {
          let currChar : string = expanded.charAt(i);
          let rand : number = Math.random();
          switch (currChar) {
              case 'X': {
                      newStr = newStr.concat('XX+YFF+');
                  }
                  break;
              case 'Y': {
                      newStr = newStr.concat('-FFX-YY');
                  break;
              }
              default: {
                  break;
              }
          }
      }

      // Recursively expand the grammar
      this.expand(depth + 1, newStr);
  }



//function to evaluate the string
  evaluate() : any {

    var pointList : vec2[] = [];
    var turtle : Turtle = new Turtle(4);
    turtle.position = vec2.fromValues(0.0, 0.0);
    turtle.orient = vec2.fromValues(0.0, 90.0);
    console.log("Turtle orientation is INITIALLy: " + turtle.orient);
    for (var i = 0; i < this.grammar.length; i++){
      let currChar : string = this.grammar.charAt(i);

      switch (currChar) {
          case '+': {
                  //rotate +90
                  console.log("+ reached");
                  turtle.rotateTurtle(90.0);
                  break;
              }
          case '-': {
                      console.log("- reached");
                      turtle.rotateTurtle(-90.0);
                      break;
                  }
          case 'F': {
                  //move forward by 0.01 and store the pixels
                  turtle.position = vec2.fromValues(turtle.position[0] + (turtle.orient[0] * 0.1),
                  turtle.position[1] + (turtle.orient[1] * 0.1));
                  pointList.push(turtle.position);
                    break;
                      }
              break;

            }

    }


    return 0;
  }

  // Get the current state, find the corresponding drawing
  // rule, and call the associated function
  drawBranch() : mat4[] {
      let transfs : mat4[] = [];


      return transfs;
  }

  drawLeaf() : mat4[] {
      let transfs : mat4[] = [];

      return transfs;
}


}

export default LSystem;
