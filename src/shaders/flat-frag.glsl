#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;
uniform float u_PopToggle;
uniform float u_TerrainToggle;


in vec2 fs_Pos;
// out vec4 out_Col;
layout(location = 0) out vec4 out_Col;

float random1( vec2 p , vec2 seed) {
  return fract(sin(dot(p + seed, vec2(127.1, 311.7))) * 43758.5453);
}

float random1( vec3 p , vec3 seed) {
  return fract(sin(dot(p + seed, vec3(987.654, 123.456, 531.975))) * 85734.3545);
}

vec2 random2( vec2 p , vec2 seed) {
  return fract(sin(vec2(dot(p + seed, vec2(311.7, 127.1)), dot(p + seed, vec2(269.5, 183.3)))) * 85734.3545);
}

float interpNoise2d(float x, float y) {
  float intX = floor(x);
  float fractX = fract(x);
  float intY = floor(y);
  float fractY = fract(y);

  float v1 = random1(vec2(intX, intY), vec2(1.f, 1.f));
  float v2 = random1(vec2(intX + 1.f, intY), vec2(1.f, 1.f));
  float v3 = random1(vec2(intX, intY + 1.f), vec2(1.f, 1.f));
  float v4 = random1(vec2(intX + 1.f, intY + 1.f), vec2(1.f, 1.f));

  float i1 = mix(v1, v2, fractX);
  float i2 = mix(v3, v4, fractX);
  return mix(i1, i2, fractY);
  return 2.0;

}


float worleyFunc(float x, float y, float numRows, float numCols) {
    float xPos = x * float(numCols) / 20.f;
    float yPos = y * float(numRows) / 20.f;

    float minDist = 60.f;
    vec2 minVec = vec2(0.f, 0.f);

    for (int i = -1; i < 2; i++) {
        for (int j = -1; j < 2; j++) {
            vec2 currGrid = vec2(floor(float(xPos)) + float(i), floor(float(yPos)) + float(j));
            vec2 currNoise = currGrid + random2(currGrid, vec2(2.0, 1.0));
            float currDist = distance(vec2(xPos, yPos), currNoise);
            if (currDist <= minDist) {
                minDist = currDist;
                minVec = currNoise;
            }
        }
    }
    return minDist;
    // return 2.0;
}

float fbmWorley(float x, float y, float height, float xScale, float yScale) {
  float total = 0.f;
  float persistence = 0.5f;
  int octaves = 7;
  float freq = 2.0;
  float amp = 1.0;
  for (int i = 0; i < octaves; i++) {
    // total += interpNoise2d( (x / xScale) * freq, (y / yScale) * freq) * amp;
    total += worleyFunc( (x / xScale) * freq, (y / yScale) * freq, 2.0, 2.0) * amp;
    freq *= 2.0;
    amp *= persistence;
  }
  return height * total;
}

float fbmWorley2(float x, float y, float height, float xScale, float yScale) {
  float total = 0.f;
  float persistence = 0.5f;
  int octaves = 7;
  float freq = 2.0;
  float amp = 1.0;
  for (int i = 0; i < octaves; i++) {
    // total += interpNoise2d( (x / xScale) * freq, (y / yScale) * freq) * amp;
    total += worleyFunc( (x / xScale) * freq, (y / yScale) * freq, 1.0, 1.0) * amp;
    freq *= 2.0;
    amp *= persistence;
  }
  return height * total;
}

float fbm(float x, float y, float height, float xScale, float yScale) {
  float total = 0.f;
  float persistence = 0.5f;
  int octaves = 8;
  float freq = 2.0;
  float amp = 1.0;
  for (int i = 0; i < octaves; i++) {
    total += interpNoise2d( (x / xScale) * freq, (y / yScale) * freq) * amp;
    freq *= 2.0;
    amp *= persistence;
  }
  return height * total;
}


void main() {

  float x = 0.5 * (fs_Pos.x + 1.0);
  float y = 0.5 * (fs_Pos.y + 1.0);

  float flat_shade = pow(worleyFunc(512.0 * x, 512.0 * y, 0.1, 0.1), 2.0);

  float computedHeight = 1.0 - pow(fbmWorley(0.8 * 512.0 * x, 0.95 * 512.0 * y, 0.9, 100.0, 120.0), 1.5);
  float worleyHeight = 0.01 * (1.0 - pow(worleyFunc(512.0 * x, 512.0 * y, 1.0, 0.1), 1.0));
  vec3 water = vec3(0.0, 0.0, 1.0);
  vec3 land = vec3(0.7, 0.5, 0.4);

  vec3 terrainRGB = mix(land, water, computedHeight);

  if (computedHeight  + worleyHeight > 0.49) {
    terrainRGB = water;
  } else {
    terrainRGB = computedHeight + land;
    terrainRGB = mix(vec3(0.50, 0.6, 1.0), terrainRGB, 0.5);
  }

  float population = pow((1.0 - fbmWorley2(512.0 * x, 512.0 * y, 0.5, 10.0, 15.0)), 4.9) * floor(0.9 + terrainRGB.g);

  out_Col = vec4(terrainRGB, population);



}
