import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class LSystem extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;

  colTemp: Array<number> = [];
  posTemp: Array<number> = [];
  norTemp: Array<number> = [];
  uvsTemp: Array<number> = [];
  idxTemp: Array<number> = [];

  constructor() {
    super(); // Call the constructor of the super class. This is required.
    //this.indices = new Uint32Array(0);
    this.positions = new Float32Array(0);
    this.normals = new Float32Array(0);
    this.colors = new Float32Array(0);

    this.idxTemp = [];
    this.posTemp = [];
    this.norTemp = [];
    this.colTemp = [];
    this.uvsTemp = [];
  }

  addIndex(newIndex: number) : void {
    this.idxTemp.push(newIndex);
  }

  addPos(newPos: number) : void {
    this.posTemp.push(newPos);
  }

  addNor(newNor: number) : void {
    this.norTemp.push(newNor);
  }

  addCol(newCol: number) : void {
    this.colTemp.push(newCol);
  }

  clear() {
    this.idxTemp = [];
    this.posTemp = [];
    this.uvsTemp = [];
    this.norTemp = [];
    this.colTemp = [];
  }

  getMaxIndex() : number {
    if (this.idxTemp.length == 0) {
      return -1;
    } else {
      var max = this.idxTemp.reduce(function(a, b) {
        return Math.max(a, b);
      });
      return max;
    }
  }

  create() {


    this.indices = new Uint32Array(this.idxTemp);
    this.positions = new Float32Array(this.posTemp);
    this.normals = new Float32Array(this.norTemp);
    this.colors = new Float32Array(this.colTemp);


    this.generateIdx();
    this.generatePos();
    this.generateNor();
    this.generateCol();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

  }
};

export default LSystem;
