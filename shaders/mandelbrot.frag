#version 330 core

out vec4 color;
in vec3 vertex_color;

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_scale;

vec3 color_offset = vec3(0.55, 0.35, 0.15);

#define HUE_SCALE 50.0
#define BAILOUT (1 << 20)
#define PI2 6.283185307179586
#define MAX_ITER 1024

vec3 palette(float iter) {
  return 0.5 + 0.5 * sin(PI2 * (color_offset + iter));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_resolution / 2 - u_center) / u_scale;

  float xx = 0;
  float yy = 0;
  float w = 0;

  int iter = 0;
  while (xx + yy < BAILOUT && iter < MAX_ITER) {
    float x = xx - yy + uv.x;
    float y = w - xx - yy + uv.y;
    float xy = x + y;

    xx = x * x;
    yy = y * y;
    w = xy * xy;
    ++iter;
  }
  
  if (iter < MAX_ITER) {
    float nu = log2(log2(xx + yy) / 2);
    float fnu = floor(1 - nu);

    float iter1 = (iter + fnu) / HUE_SCALE;
    float iter2 = (iter + 1 + fnu) / HUE_SCALE;

    float iterp = 1 - nu - fnu;
    
    vec3 color1 = palette(iter1);
    vec3 color2 = palette(iter2);

    color = vec4(color1 + (color2 - color1) * iterp, 1.0);
  } else {
    color = vec4(0.0, 0.0, 0.0, 1.0);
  }
};
