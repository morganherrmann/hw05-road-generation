

import { vec3, vec2, vec4, mat4, quat } from 'gl-matrix';


//grid glass to represent the city

class Grid {

  horizontal: vec4[] = [];

  vertical : vec4[] = [];


  rand() : number{
    return Math.random() / 25.0;
  }

  constructor() {

      //sets a random start for the LSystem
      this.horizontal.push(vec4.fromValues(-0.15, 0.0 + this.rand(), 1.0, 0.0));
      this.horizontal.push(vec4.fromValues(-0.15, 0.1, 1.0, 0.1));
      this.horizontal.push(vec4.fromValues(-0.25, 0.2, 1.0, 0.2 + this.rand() ));
      this.horizontal.push(vec4.fromValues(-0.24, 0.25, 1.0, 0.25));
      this.horizontal.push(vec4.fromValues(-0.15, 0.37, 1.0, 0.37));
      this.horizontal.push(vec4.fromValues(-0.13, 0.45 + this.rand(), 1.0, 0.45));
      this.horizontal.push(vec4.fromValues(-0.10, 0.53, 1.0, 0.55));

      //negative lines  here

      this.horizontal.push(vec4.fromValues(-0.25, -0.1, 1.0, -0.1));
      this.horizontal.push(vec4.fromValues(-0.5, -0.2 + this.rand(), 1.0, -0.2));
      this.horizontal.push(vec4.fromValues(-0.55, -0.3, 1.0, -0.3));
      this.horizontal.push(vec4.fromValues(-0.55, -0.4, 1.0, -0.4 + this.rand()));
      this.horizontal.push(vec4.fromValues(-0.6, -0.5, 1.0, -0.5 ));
      this.horizontal.push(vec4.fromValues(-0.7, -0.6, 1.0, -0.6));
      this.horizontal.push(vec4.fromValues(-0.8, -0.7 + this.rand(), 1.0, -0.7));
      this.horizontal.push(vec4.fromValues(-0.9, -0.8, 1.0, -0.8 + this.rand()));
      this.horizontal.push(vec4.fromValues(-1.0, -0.9 + this.rand(), 1.0, -0.9));



      this.vertical.push(vec4.fromValues(0.0, -1.0, 0.0, 0.72));
      this.vertical.push(vec4.fromValues(0.1, -1.0, 0.1, 0.73));
      this.vertical.push(vec4.fromValues(0.2, -1.0, 0.2, 0.73));
      this.vertical.push(vec4.fromValues(0.3, -1.0, 0.3, 0.69));
      this.vertical.push(vec4.fromValues(0.4, -1.0, 0.4, 0.64));
      this.vertical.push(vec4.fromValues(0.5, -1.0, 0.5, 0.64));
      this.vertical.push(vec4.fromValues(0.6, -1.0, 0.6, 0.62));
      this.vertical.push(vec4.fromValues(0.7, -1.0, 0.7, 0.66));


  }

  getVector(idx : number): vec4{
    return this.horizontal[idx];
  }




}

export default Grid;
