#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;
uniform sampler2D u_RenderedTexture;
uniform float u_Population;
uniform float u_Terrain;


in vec2 fs_Pos;
out vec4 out_Col;

void main() {

  float x = 0.5 * (fs_Pos.x + 1.0);
  float y = 0.5 * (fs_Pos.y + 1.0);

  vec4 gray = texture(u_RenderedTexture, vec2( x,  y));

  vec3 finalColor = vec3(0.0);
  if (u_Terrain == 1.0) {
    finalColor += gray.rgb;
  }
  if (u_Population == 1.0) {
    finalColor += vec3(gray.a);
  }
  if (u_Population + u_Terrain == 0.0) {
    finalColor = vec3(1.0);
  }
    out_Col = vec4(finalColor, 1.0);

}
