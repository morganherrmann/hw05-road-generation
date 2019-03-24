import {vec3, vec2, vec4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import LSyst from './LSyst';
import Grid from './Grid';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';


//import Road from './Road';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  showLand: true,
  showPopulation: true,
  denseCity : true,
  range : 0,
  branchProb : 0.0,
};

let square: Square;
let screenQuad: ScreenQuad;
let time: number = 0.0;

let last : vec2;

let left : vec4;
let right : vec4;

let highWayEdges : vec4[] = [];

let rangeval : number = 0.0;
let branchval : number = 0.0;


let roadSystem : LSyst;
let roadSystem2 : LSyst;

let grid : Grid;
let horizontal_lines : vec4[] = [];
let vertical_lines : vec4[] = [];
//let road: Road;



function random(min : number , max :number) : number // min and max included
{
    return Math.random() * (max - min) + min;
}

function loadScene() {

    //keep track of the places with high populationDensity


    var a1 : vec4 = vec4.fromValues(-1.0, -1.0, -0.7, -0.80);
    var a2 : vec4 = vec4.fromValues(-0.95, -0.95, -0.75, -0.85);


    console.log(rangeval);
    roadSystem = new LSyst(vec2.fromValues(random(-0.8, 0.0), -1.0), rangeval, branchval);
    roadSystem2 = new LSyst(vec2.fromValues(random(0.8, 1.0), -1.0), rangeval, branchval);
    grid = new Grid();

}


function randomInt(range : number) {
  return Math.floor(Math.random() * range);
}
// Fill the buffer with the values that define a rectangle.
function setRectangle(gl : WebGL2RenderingContext, x : number , y : number, width : number, height : number) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}




function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);



  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'showLand');
  gui.add(controls, 'showPopulation');
  gui.add(controls, 'denseCity');

  gui.add(controls, 'branchProb', 0.0, 5.0).onChange(function(val: number){

      rangeval = val;
      console.log(rangeval);
      roadSystem = new LSyst(vec2.fromValues(random(-0.8, 0.0), -1.0), rangeval, branchval);
      roadSystem2 = new LSyst(vec2.fromValues(random(0.8, 1.0), -1.0), rangeval, branchval);
      roadSystem.evaluate(13);
      roadSystem2.evaluate(13);
      grid = new Grid();
      horizontal_lines = [];
      vertical_lines = [];

        for (var i = 0; i < grid.horizontal.length; i++){

            var curr : vec4 = grid.horizontal[i];
            var curr_y : number = curr[1];    //horizontal so we only need one coordinate

            var x_coords : number[] = [];

            for (var j = 0; j < roadSystem.pointList.length; j += 2){
              //get the min y and max y of this segment
              var segment : vec4 =roadSystem.pointList[j];
              var x0 : number = segment[0];
              var y0 : number = segment[1];
              var x1 : number = segment[2];
              var y1 : number = segment[3];

              if ((curr_y >= y0 && curr_y <= y1) || (curr_y <= y0 && curr_y >= y1)){
                //this means we have hit the inside.
                //compute the intersection. ughhh.
                var slope : number = (y1 - y0) / (x1 - x0);
                console.log("Slope is " + slope);
                var x_solved : number = (curr_y - y1 + (slope * x1)) / slope;
                x_coords.push(x_solved);
                console.log("Found an x coordinate " + x_solved);

              }
            }

            for (var j = 0; j < roadSystem2.pointList.length; j += 2){
              //get the min y and max y of this segment
              var segment : vec4 =roadSystem2.pointList[j];
              var x0 : number = segment[0];
              var y0 : number = segment[1];
              var x1 : number = segment[2];
              var y1 : number = segment[3];

              // console.log("y0 is: " + y0 + " y1: " + y1 );

              if ((curr_y >= y0 && curr_y <= y1) || (curr_y <= y0 && curr_y >= y1)){
                //this means we have hit the inside.
                //compute the intersection. ughhh.
                var slope : number = (y1 - y0) / (x1 - x0);
                //console.log("Slope is " + slope);
                var x_solved : number = (curr_y - y1 + (slope * x1)) / slope;
                x_coords.push(x_solved);
                //console.log("Found an x coordinate " + x_solved);

              }
            }

            //x_coords.push(1.1); // potential max
            //sort in ascending order
            var sorted = x_coords.sort((n1,n2) => n1 - n2);

            if (sorted [0] > curr[0]){
              // console.log("Sorted[0] is " + sorted[0]);
              // console.log("curr[0] is " + curr[0]);
            curr[0] = sorted[0];
          }

            if (sorted[1] < curr[2] && sorted[1] >= curr[0]){
              // console.log("Sorted[1] is " + sorted[1]);
              // console.log("curr[2] is " + curr[2]);
            curr[2] = sorted[1];
          }
            var p1 : vec4 = vec4.fromValues(curr[0], curr[1] - 0.015, curr[2], curr[3] - 0.015);
            horizontal_lines.push(curr);
            horizontal_lines.push(p1);



        }


        for (var i = 0; i < grid.vertical.length; i++){

          var curr : vec4 = grid.vertical[i];
          var p1 : vec4 = vec4.fromValues(curr[0] + 0.01, curr[1], curr[2] + 0.01, curr[3]);
          vertical_lines.push(curr);
          vertical_lines.push(p1);

          var curr_x : number = curr[0];    //vertical so we only need one coordinate

          var y_coords : number[] = [];

        }


        //handling grid eval


  });



  gui.add(controls, 'range', 0.0, 5.0).onChange(function(val: number){

      rangeval = val;
      console.log(rangeval);
      roadSystem = new LSyst(vec2.fromValues(random(-0.8, 0.0), -1.0), rangeval, branchval);
      roadSystem2 = new LSyst(vec2.fromValues(random(0.8, 1.0), -1.0), rangeval, branchval);
      roadSystem.evaluate(13);
      roadSystem2.evaluate(13);
      grid = new Grid();
      horizontal_lines = [];
      vertical_lines = [];

        for (var i = 0; i < grid.horizontal.length; i++){

            var curr : vec4 = grid.horizontal[i];
            var curr_y : number = curr[1];    //horizontal so we only need one coordinate

            var x_coords : number[] = [];

            for (var j = 0; j < roadSystem.pointList.length; j += 2){
              //get the min y and max y of this segment
              var segment : vec4 =roadSystem.pointList[j];
              var x0 : number = segment[0];
              var y0 : number = segment[1];
              var x1 : number = segment[2];
              var y1 : number = segment[3];

              if ((curr_y >= y0 && curr_y <= y1) || (curr_y <= y0 && curr_y >= y1)){
                //this means we have hit the inside.
                //compute the intersection. ughhh.
                var slope : number = (y1 - y0) / (x1 - x0);
                console.log("Slope is " + slope);
                var x_solved : number = (curr_y - y1 + (slope * x1)) / slope;
                x_coords.push(x_solved);
                console.log("Found an x coordinate " + x_solved);

              }
            }

            for (var j = 0; j < roadSystem2.pointList.length; j += 2){
              //get the min y and max y of this segment
              var segment : vec4 =roadSystem2.pointList[j];
              var x0 : number = segment[0];
              var y0 : number = segment[1];
              var x1 : number = segment[2];
              var y1 : number = segment[3];

              // console.log("y0 is: " + y0 + " y1: " + y1 );

              if ((curr_y >= y0 && curr_y <= y1) || (curr_y <= y0 && curr_y >= y1)){
                //this means we have hit the inside.
                //compute the intersection. ughhh.
                var slope : number = (y1 - y0) / (x1 - x0);
                //console.log("Slope is " + slope);
                var x_solved : number = (curr_y - y1 + (slope * x1)) / slope;
                x_coords.push(x_solved);
                //console.log("Found an x coordinate " + x_solved);

              }
            }

            //x_coords.push(1.1); // potential max
            //sort in ascending order
            var sorted = x_coords.sort((n1,n2) => n1 - n2);

            if (sorted [0] > curr[0]){
              // console.log("Sorted[0] is " + sorted[0]);
              // console.log("curr[0] is " + curr[0]);
            curr[0] = sorted[0];
          }

            if (sorted[1] < curr[2] && sorted[1] >= curr[0]){
              // console.log("Sorted[1] is " + sorted[1]);
              // console.log("curr[2] is " + curr[2]);
            curr[2] = sorted[1];
          }
            var p1 : vec4 = vec4.fromValues(curr[0], curr[1] - 0.015, curr[2], curr[3] - 0.015);
            horizontal_lines.push(curr);
            horizontal_lines.push(p1);



        }


        for (var i = 0; i < grid.vertical.length; i++){

          var curr : vec4 = grid.vertical[i];
          var p1 : vec4 = vec4.fromValues(curr[0] + 0.01, curr[1], curr[2] + 0.01, curr[3]);
          vertical_lines.push(curr);
          vertical_lines.push(p1);

          var curr_x : number = curr[0];    //vertical so we only need one coordinate

          var y_coords : number[] = [];

        }


        //handling grid eval


  });




  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);


  // Initial call to load scene
  loadScene();

  screenQuad = new ScreenQuad();
  screenQuad.create();
  const camera = new Camera(vec3.fromValues(50, 50, 10), vec3.fromValues(50, 50, 0));



  roadSystem.evaluate(13);
  roadSystem2.evaluate(13);

//handling the grid eval

  for (var i = 0; i < grid.horizontal.length; i++){

      var curr : vec4 = grid.horizontal[i];
      var curr_y : number = curr[1];    //horizontal so we only need one coordinate

      var x_coords : number[] = [];

      for (var j = 0; j < roadSystem.pointList.length; j += 2){
        //get the min y and max y of this segment
        var segment : vec4 =roadSystem.pointList[j];
        var x0 : number = segment[0];
        var y0 : number = segment[1];
        var x1 : number = segment[2];
        var y1 : number = segment[3];

        if ((curr_y >= y0 && curr_y <= y1) || (curr_y <= y0 && curr_y >= y1)){
          //this means we have hit the inside.
          //compute the intersection. ughhh.
          var slope : number = (y1 - y0) / (x1 - x0);
          console.log("Slope is " + slope);
          var x_solved : number = (curr_y - y1 + (slope * x1)) / slope;
          x_coords.push(x_solved);
          console.log("Found an x coordinate " + x_solved);

        }
      }

      for (var j = 0; j < roadSystem2.pointList.length; j += 2){
        //get the min y and max y of this segment
        var segment : vec4 =roadSystem2.pointList[j];
        var x0 : number = segment[0];
        var y0 : number = segment[1];
        var x1 : number = segment[2];
        var y1 : number = segment[3];

        // console.log("y0 is: " + y0 + " y1: " + y1 );

        if ((curr_y >= y0 && curr_y <= y1) || (curr_y <= y0 && curr_y >= y1)){
          //this means we have hit the inside.
          //compute the intersection. ughhh.
          var slope : number = (y1 - y0) / (x1 - x0);
          //console.log("Slope is " + slope);
          var x_solved : number = (curr_y - y1 + (slope * x1)) / slope;
          x_coords.push(x_solved);
          //console.log("Found an x coordinate " + x_solved);

        }
      }

      //x_coords.push(1.1); // potential max
      //sort in ascending order
      var sorted = x_coords.sort((n1,n2) => n1 - n2);

      if (sorted [0] > curr[0]){
        // console.log("Sorted[0] is " + sorted[0]);
        // console.log("curr[0] is " + curr[0]);
      curr[0] = sorted[0];
    }

      if (sorted[1] < curr[2] && sorted[1] >= curr[0]){
        // console.log("Sorted[1] is " + sorted[1]);
        // console.log("curr[2] is " + curr[2]);
      curr[2] = sorted[1];
    }
      var p1 : vec4 = vec4.fromValues(curr[0], curr[1] - 0.015, curr[2], curr[3] - 0.015);
      horizontal_lines.push(curr);
      horizontal_lines.push(p1);



  }


  for (var i = 0; i < grid.vertical.length; i++){

    var curr : vec4 = grid.vertical[i];
    var p1 : vec4 = vec4.fromValues(curr[0] + 0.01, curr[1], curr[2] + 0.01, curr[3]);
    vertical_lines.push(curr);
    vertical_lines.push(p1);

    var curr_x : number = curr[0];    //vertical so we only need one coordinate

    var y_coords : number[] = [];

  }






  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  // gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE); // Additive blending

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  const texture = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/textureShader.glsl')),
  ]);

  const rect = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/square-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/square-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);



    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    const texWidth = window.innerWidth;
    const texHeight = window.innerHeight;

    var fb = gl.createFramebuffer();
    var myTexture = gl.createTexture();
    var rb = gl.createRenderbuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.bindTexture(gl.TEXTURE_2D, myTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texWidth, texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, texWidth, texHeight);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rb);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, myTexture, 0);


    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);

    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
      console.log("error");
    }

    // Render 3D Scene:

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // done with shader fun code for this part

    if (controls.showPopulation == true) {
      texture.setPopToggle(1.0);
    } else {
      texture.setPopToggle(0.0);
    }

    if (controls.showLand == true) {
      texture.setTerrainToggle(1.0);
    } else {
      texture.setTerrainToggle(0.0);
    }

    //variable to control how many road lines we draw
    var density : number = 2;
    if (controls.denseCity == true){
      density = 2;
    } else {
      density = 4;
    }

    renderer.render(camera, flat,[screenQuad]);
    //road = new Road(myTexture);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, myTexture);

    renderer.render(camera, texture, [screenQuad]);


    for(var i = 0; i < roadSystem.pointList.length; i+=2){

       square = new Square(roadSystem.pointList[i], roadSystem.pointList[i + 1]);
       square.create();
       renderer.render(camera, rect, [square]);

    }

    for(var i = 0; i < roadSystem2.pointList.length; i+=2){

       square = new Square(roadSystem2.pointList[i], roadSystem2.pointList[i + 1]);
       square.create();
       renderer.render(camera, rect, [square]);

    }

    for(var i = 0; i < horizontal_lines.length; i+=density){

       square = new Square(horizontal_lines[i], horizontal_lines[i + 1]);
       square.create();
       renderer.render(camera, rect, [square]);

    }

    for(var i = 0; i < vertical_lines.length; i+=density){
       square = new Square(vertical_lines[i], vertical_lines[i + 1]);
       square.create();
       renderer.render(camera, rect, [square]);
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
