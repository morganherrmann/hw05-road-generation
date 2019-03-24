import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class Square extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;

  p1 : vec4;
  p2 : vec4;

  constructor(point1 : vec4, point2 : vec4) {
    super();
    this.p1 = point1;
    this.p2 = point2;
  }

  create() {

  this.indices = new Uint32Array([0, 1, 2,
                                  1, 2, 3]);
  // this.positions = new Float32Array([-0.05, -0.05, 0.999, 1,
  //                                    0.05, -0.05, 0.999, 1,
  //                                    0.05, 0.05, 0.999, 1,
  //                                    -0.05, 0.05, 0.999, 1]);

  // this.positions = new Float32Array([0.04, 0.57, 0.999, 1, //curr1 1
  //                                    0.08, 0.57, 0.999, 1, //curr1 2
  //                                    0.04, -0.3, 0.999, 1,    //curr2 1
  //                                    0.08, -0.3, 0.999, 1]);  //curr2 2

  this.positions = new Float32Array([this.p1[0], this.p1[1], 0.999, 1, //curr1 1
                                     this.p1[2], this.p1[3], 0.999, 1, //curr1 2
                                     this.p2[0], this.p2[1], 0.999, 1,    //curr2 1
                                     this.p2[2], this.p2[3], 0.999, 1]);  //curr2 2

    this.generateIdx();
    this.generatePos();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    this.numInstances = 1;

    //console.log(`Created Square`);
  }
};

export default Square;
